import type { User, RegisterResponse } from '../../domain/models/User';

export interface UserRepository {
  register(payload: User): Promise<RegisterResponse>;
}
