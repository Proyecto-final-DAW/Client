import type React from 'react';

import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { LoadingPixel } from './LoadingPixel';

type Props<T> = {
  loading: boolean;
  error: string | null;
  data: T | null | undefined;
  empty?: (data: T) => boolean;
  onRetry?: () => void;
  loadingLabel?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyCta?: { label: string; to: string };
  emptyRender?: () => React.ReactNode;
  children: (data: T) => React.ReactNode;
};

export const AsyncState = <T,>(props: Props<T>): React.JSX.Element => {
  if (props.loading) {
    return <LoadingPixel label={props.loadingLabel} />;
  }

  if (props.error) {
    return <ErrorState message={props.error} onRetry={props.onRetry} />;
  }

  if (props.data === null || props.data === undefined) {
    if (props.emptyRender) {
      return <>{props.emptyRender()}</>;
    }

    return (
      <EmptyState
        title={props.emptyTitle ?? 'Nada por aquí'}
        description={props.emptyDescription}
        cta={props.emptyCta}
      />
    );
  }

  // 🧠 Aquí TypeScript ya sabe que data es T
  if (props.empty?.(props.data)) {
    if (props.emptyRender) {
      return <>{props.emptyRender()}</>;
    }

    return (
      <EmptyState
        title={props.emptyTitle ?? 'Nada por aquí'}
        description={props.emptyDescription}
        cta={props.emptyCta}
      />
    );
  }

  return <>{props.children(props.data)}</>;
};
