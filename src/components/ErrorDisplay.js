import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ErrorDisplay = ({ error, onRetry }) => {
    return (_jsxs("div", { className: "error-display", children: [_jsx("h3", { children: "Error" }), _jsx("p", { children: error }), onRetry && _jsx("button", { onClick: onRetry, children: "Retry" })] }));
};
export default ErrorDisplay;
