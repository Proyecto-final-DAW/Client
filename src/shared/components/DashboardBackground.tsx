export const DashboardBackground = (): React.JSX.Element => {
  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/images/4.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 65%',
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0 backdrop-blur-sm"
        style={{
          background:
            'linear-gradient(to bottom, rgba(5,5,9,0.70) 0%, rgba(5,5,9,0.80) 100%)',
        }}
      />
    </>
  );
};
