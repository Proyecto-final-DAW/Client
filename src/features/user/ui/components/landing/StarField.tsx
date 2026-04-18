const STARS = [
  { top: '6%', left: '12%', delay: '0s' },
  { top: '14%', left: '82%', delay: '0.4s' },
  { top: '22%', left: '38%', delay: '1.1s' },
  { top: '30%', left: '62%', delay: '0.7s' },
  { top: '42%', left: '18%', delay: '1.6s' },
  { top: '48%', left: '88%', delay: '0.2s' },
  { top: '56%', left: '30%', delay: '1.3s' },
  { top: '62%', left: '72%', delay: '0.5s' },
  { top: '70%', left: '10%', delay: '1.8s' },
  { top: '76%', left: '48%', delay: '0.9s' },
  { top: '82%', left: '84%', delay: '1.4s' },
  { top: '88%', left: '22%', delay: '0.3s' },
  { top: '36%', left: '8%', delay: '2.0s' },
  { top: '20%', left: '96%', delay: '0.6s' },
  { top: '68%', left: '94%', delay: '1.7s' },
];

export const StarField = (): React.JSX.Element => {
  return (
    <>
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute h-[3px] w-[3px] bg-white animate-twinkle pointer-events-none"
          style={{ top: s.top, left: s.left, animationDelay: s.delay }}
        />
      ))}
    </>
  );
};
