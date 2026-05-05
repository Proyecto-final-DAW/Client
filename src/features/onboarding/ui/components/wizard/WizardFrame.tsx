import type { ReactNode } from 'react';

interface WizardFrameProps {
  children: ReactNode;
}

export const WizardFrame = (props: WizardFrameProps): React.JSX.Element => {
  return (
    <div className="relative border-2 border-green-500/60 bg-card px-5 sm:px-7 pt-6 pb-6 shadow-[0_0_0_4px_rgba(10,10,15,0.8),0_0_60px_rgba(34,197,94,0.35),0_20px_50px_rgba(0,0,0,0.8)]">
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-green-500/60" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-green-500/60" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-green-500/60" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-green-500/60" />
      {props.children}
    </div>
  );
};
