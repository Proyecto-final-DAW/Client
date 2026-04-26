import type {
  Progress,
  RegisterWeightInput,
} from '../../domain/models/Progress';

export interface ProgressRepository {
  getWeightHistory(userId: number, token?: string): Promise<Progress[]>;
  registerWeight(
    userId: number,
    input: RegisterWeightInput,
    token?: string
  ): Promise<Progress>;
}
