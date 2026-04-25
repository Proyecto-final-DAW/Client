import type { LoginResponse } from '../../../../../../shared/core/domain/models/UserInfo';
import type { UserInfoRepository } from '../../../application/ports/UserInfoRepository';

export class MockUserInfoRepository implements UserInfoRepository {
  async login(email: string, _password: string): Promise<LoginResponse> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
      message: 'Mock login successful',
      token: 'mock-jwt-token',
      user: {
        id: 1,
        name: 'Mock User',
        email,
        onboarding_completed: false,
      },
    };
  }
}
