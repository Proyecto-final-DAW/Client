import type { UserRepository } from '../../../application/ports/UserRepository';
import type { RegisterResponse } from '../../../domain/models/User';

export class MockUserRepository implements UserRepository {
  async register(
    name: string,
    email: string,
    _password: string
  ): Promise<RegisterResponse> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
      message: 'Mock register successful',
      token: 'mock-jwt-token',
      user: {
        id: 1,
        name,
        email,
        onboarding_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };
  }
}
