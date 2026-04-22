export default function WizardBackground() {
  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/images/5.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 42%',
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0 backdrop-blur-sm"
        style={{
          background:
            'linear-gradient(to bottom, rgba(5,5,9,0.68) 0%, rgba(5,5,9,0.75) 100%)',
        }}
      />
    </>
  );
}
