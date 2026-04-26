import type { UserRepository } from '../../../application/ports/UserRepository';
import type { RegisterResponse } from '../../../domain/models/User';

export class MockUserRepository implements UserRepository {
  async register(): Promise<RegisterResponse> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
      message: 'Mock register successful',
    };
  }
}
