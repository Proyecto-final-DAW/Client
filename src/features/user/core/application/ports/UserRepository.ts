import type { RegisterResponse } from '../../domain/models/User';

export interface UserRepository {
  register(
    name: string,
    email: string,
    password: string
  ): Promise<RegisterResponse>;
}
