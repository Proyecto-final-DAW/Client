import type { PropsWithChildren } from 'react';

import { PixelCorners } from '../landing/PixelCorners';

interface LoginFormCardProps extends PropsWithChildren {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
export const LoginFormCard = ({
  onSubmit,
  children,
}: LoginFormCardProps): React.JSX.Element => {
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative border-2 border-green-500/60 bg-[#0d0d14] px-6 sm:px-7 pt-6 sm:pt-7 pb-12 sm:pb-16 shadow-[0_0_0_4px_rgba(10,10,15,0.8),0_0_60px_rgba(34,197,94,0.35),0_20px_50px_rgba(0,0,0,0.8)]"
    >
      <PixelCorners size="md" className="border-green-500/60" />
      <div className="text-center text-sm sm:text-base font-['Press_Start_2P'] text-green-500 mb-12 tracking-widest">
        ─ LOGIN ─
      </div>
      {children}
    </form>
  );
};
