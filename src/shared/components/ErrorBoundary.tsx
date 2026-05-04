import { Component, type ReactNode } from 'react';

import { ErrorState } from './ErrorState';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * App-wide React error boundary. Catches uncaught render errors and shows
 * the existing ErrorState UI with a "reload" action so the user can recover
 * from a white screen instead of being stuck.
 *
 * Class component because React error boundaries cannot be hooks (no
 * `componentDidCatch` equivalent in the hook API as of React 19).
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(
    error: Error,
    errorInfo: { componentStack?: string }
  ): void {
    // eslint-disable-next-line no-console
    console.error('Uncaught render error:', error, errorInfo);
  }

  private handleReload = (): void => {
    window.location.assign('/');
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <ErrorState
          message={
            this.state.error?.message ??
            'Algo ha fallado. Recarga la aplicacion.'
          }
          onRetry={this.handleReload}
        />
      );
    }
    return this.props.children;
  }
}
