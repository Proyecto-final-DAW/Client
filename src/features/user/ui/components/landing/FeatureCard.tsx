import type { ComponentType, SVGProps } from 'react';

import { PixelCorners } from '../../../../../shared/components/PixelCorners';

type HeroIconCmp = ComponentType<SVGProps<SVGSVGElement>>;

type FeatureCardProps = {
  Icon: HeroIconCmp;
  title: string;
  subtitle: string;
  description: string;
};

export const FeatureCard = (props: FeatureCardProps): React.JSX.Element => {
  return (
    <div className="group bg-[#12121a]/85 backdrop-blur-md border-2 border-[#1e1e2e] hover:border-green-500/50 p-5 sm:p-6 transition-all duration-300 relative overflow-hidden">
      <PixelCorners
        size="sm"
        className="border-green-500/0 group-hover:border-green-500/60 transition-all duration-300"
      />

      <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-sm border-2 border-[#1e1e2e] bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
        <props.Icon className="h-7 w-7 text-green-400" />
      </div>
      <div className="font-['Press_Start_2P'] text-[10px] sm:text-xs text-green-500 mb-1">
        {props.title}
      </div>
      <div className="font-['Press_Start_2P'] text-[8px] sm:text-[10px] text-[#e4e4e7] mb-3 group-hover:text-green-400 transition-colors">
        {props.subtitle}
      </div>
      <p className="text-[9px] sm:text-[10px] text-[#71717a] leading-loose font-['Press_Start_2P'] tracking-wide">
        {props.description}
      </p>
    </div>
  );
};
