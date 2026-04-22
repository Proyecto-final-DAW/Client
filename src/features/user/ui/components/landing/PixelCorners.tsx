type PixelCornersProps = {
  size?: 'sm' | 'md';
  className?: string;
};

const SIZE_CLASS: Record<NonNullable<PixelCornersProps['size']>, string> = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
};

export const PixelCorners = ({
  size = 'sm',
  className = 'border-green-500/40',
}: PixelCornersProps): React.JSX.Element => {
  const base = `absolute ${SIZE_CLASS[size]} ${className}`;
  return (
    <>
      <div className={`${base} top-0 left-0 border-t-2 border-l-2`} />
      <div className={`${base} top-0 right-0 border-t-2 border-r-2`} />
      <div className={`${base} bottom-0 left-0 border-b-2 border-l-2`} />
      <div className={`${base} bottom-0 right-0 border-b-2 border-r-2`} />
    </>
  );
};
