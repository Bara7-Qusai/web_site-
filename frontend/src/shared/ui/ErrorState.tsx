import type { ReactNode } from 'react';

interface ErrorStateProps {
  title: string;
  message?: string;
  action?: ReactNode;
}

export function ErrorState({ title, message, action }: ErrorStateProps) {
  return (
    <div className="state state--error" role="alert">
      <h2>{title}</h2>
      {message !== undefined && <p>{message}</p>}
      {action}
    </div>
  );
}
