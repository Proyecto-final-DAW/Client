export const WorkoutBackground = (): React.JSX.Element => {
  return (
    <>
      {/* Background image starts at 4rem from the top so the artwork doesn't
          tuck under the sticky header. The dark overlay shares the same
          offset, otherwise the gradient would visually cover the difference
          and any tweak to the offset would look like nothing changed. */}
      <div
        className="fixed left-0 right-0 bottom-0 pointer-events-none z-0"
        style={{
          top: '0',
          // Anchor at bottom but pushed 30px further down so the image
          // bottom sits slightly below the viewport (the characters stay
          // visible but the lower band has a touch of breathing room).
          backgroundImage: "url('/images/3.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center calc(100% + 30px)',
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
        }}
      />
      <div
        className="fixed left-0 right-0 bottom-0 pointer-events-none z-0 backdrop-blur-sm"
        style={{
          top: '0',
          background:
            'linear-gradient(to bottom, rgba(5,5,9,0.78) 0%, rgba(5,5,9,0.88) 100%)',
        }}
      />
    </>
  );
};
