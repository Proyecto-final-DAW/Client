import { motion } from 'framer-motion';

type Props = {
  label?: string;
};

export const LoadingPixel = (props: Props): React.JSX.Element => {
  const label = props.label ?? 'CARGANDO';

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="font-['Press_Start_2P'] text-sm sm:text-base tracking-widest text-green-400 [text-shadow:2px_2px_0_#000,0_0_16px_rgba(34,197,94,0.55)]">
        {label}
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              times: [0, 0.2, 0.6, 1],
            }}
          >
            .
          </motion.span>
        ))}
      </p>
    </div>
  );
};
