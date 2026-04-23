import { motion } from 'framer-motion';

type Props = {
  userName?: string;
};

export const DashboardHeader = (props: Props): React.JSX.Element => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mb-8"
    >
      <div className="font-['Press_Start_2P'] text-[10px] tracking-widest text-green-500 mb-2">
        ─ PANEL DEL HÉROE ─
      </div>
      <h1 className="font-['Press_Start_2P'] text-lg sm:text-2xl text-[#e4e4e7] leading-relaxed [text-shadow:3px_3px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000,0_0_22px_rgba(0,0,0,1)]">
        {props.userName ? (
          <>
            BIENVENIDO{' '}
            <span className="text-green-400 [text-shadow:3px_3px_0_#000,0_0_24px_rgba(34,197,94,0.55)]">
              {props.userName.toUpperCase()}
            </span>
          </>
        ) : (
          <>
            TU{' '}
            <span className="text-green-400 [text-shadow:3px_3px_0_#000,0_0_24px_rgba(34,197,94,0.55)]">
              LEYENDA
            </span>
          </>
        )}
      </h1>
    </motion.div>
  );
};
