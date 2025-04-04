import * as React from 'react'

interface ErrorDisplayProps {
  error: string
  onRetry?: () => void
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  return (
    <div className="error-display">
      <h3>Error</h3>
      <p>{error}</p>
      {onRetry && <button onClick={onRetry}>Retry</button>}
    </div>
  )
}

export default ErrorDisplay