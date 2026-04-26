import type { Cards } from '../../domain/models/Cards';

export interface CardsRepository {
  getCards(): Promise<Cards>;
}
