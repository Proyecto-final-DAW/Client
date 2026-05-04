import type { ReactNode } from 'react';

import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { LoadingPixel } from './LoadingPixel';

type EmptyCta =
  | { label: string; to: string }
  | { label: string; onClick: () => void };

type Props<T> = {
  loading: boolean;
  error: string | null;
  data: T | null | undefined;
  empty?: (data: T) => boolean;
  onRetry?: () => void;
  loadingLabel?: string;
  emptyIcon?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyCta?: EmptyCta;
  children: (data: T) => ReactNode;
};

export const AsyncState = <T,>(props: Props<T>): React.JSX.Element => {
  if (props.loading) {
    return <LoadingPixel label={props.loadingLabel} />;
  }
  if (props.error) {
    return <ErrorState message={props.error} onRetry={props.onRetry} />;
  }
  if (props.data == null || props.empty?.(props.data) === true) {
    return (
      <EmptyState
        icon={props.emptyIcon}
        title={props.emptyTitle ?? 'Nada por aqui'}
        description={props.emptyDescription}
        cta={props.emptyCta}
      />
    );
  }
  return <>{props.children(props.data)}</>;
};
