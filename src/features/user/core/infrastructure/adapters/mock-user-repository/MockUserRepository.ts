import type { UserRepository } from '../../../application/ports/UserRepository';
import type { RegisterResponse } from '../../../domain/models/User';

export class MockUserRepository implements UserRepository {
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<RegisterResponse> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
      message: 'Mock register successful',
      token: 'mock-jwt-token',
      user: {
        id: 1,
        name,
        email,
        password,
      },
    };
  }
}
