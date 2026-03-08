import { Carousel } from './Carousel';
import { Hero } from './Hero';

export const Landing = (): React.JSX.Element => {
  return (
    <div>
      <Hero />
      <Carousel />
    </div>
  );
};
