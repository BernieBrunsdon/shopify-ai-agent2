from datetime import datetime
from typing import TYPE_CHECKING, Optional
from uuid import UUID

from sqlalchemy import ForeignKey, and_, delete, inspect, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from core.db.models import Base
from core.ui.base import UserInput as UserInputData

if TYPE_CHECKING:
    from core.db.models import Branch, ProjectState


class UserInput(Base):
    __tablename__ = "user_inputs"

    # ID and parent FKs
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    branch_id: Mapped[UUID] = mapped_column(ForeignKey("branches.id", ondelete="CASCADE"))
    project_state_id: Mapped[Optional[UUID]] = mapped_column(ForeignKey("project_states.id", ondelete="SET NULL"))

    # Attributes
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    question: Mapped[str] = mapped_column()
    answer_text: Mapped[Optional[str]] = mapped_column()
    answer_button: Mapped[Optional[str]] = mapped_column()
    cancelled: Mapped[bool] = mapped_column()

    # Relationships
    branch: Mapped["Branch"] = relationship(back_populates="user_inputs", lazy="raise")
    project_state: Mapped["ProjectState"] = relationship(back_populates="user_inputs", lazy="raise")

    @classmethod
    def from_user_input(cls, project_state: "ProjectState", question: str, user_input: UserInputData) -> "UserInput":
        """
        Store the user input in the database.

        Note this just creates the UserInput object. It is committed to the
        database only when the DB session itself is comitted.

        :param project_state: Project state to associate the request log with.
        :param question: Question the user was asked.
        :param user_input: User input.
        :return: Newly created User input in the database.
        """
        session = inspect(project_state).async_session

        obj = cls(
            project_state=project_state,
            branch=project_state.branch,
            question=question,
            answer_text=user_input.text,
            answer_button=user_input.button,
            cancelled=user_input.cancelled,
        )
        session.add(obj)
        return obj

    @staticmethod
    async def find_user_inputs(session: AsyncSession, project_state, branch_id) -> Optional[list["UserInput"]]:
        from core.db.models import UserInput

        user_input = await session.execute(
            select(UserInput).where(
                and_(UserInput.branch_id == branch_id, UserInput.project_state_id == project_state.id)
            )
        )
        user_input = user_input.scalars().all()
        return user_input if len(user_input) > 0 else []

    @classmethod
    async def delete_orphans(cls, session: AsyncSession):
        """
        Delete UserInput objects that have no associated ProjectState.

        :param session: The database session.
        """
        await session.execute(delete(UserInput).where(UserInput.project_state_id.is_(None)))
