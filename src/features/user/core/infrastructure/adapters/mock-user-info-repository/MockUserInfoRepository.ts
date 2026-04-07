import type { UserInfoRepository } from '../../../application/ports/UserInfoRepository';
import type {
  LoginResponse,
  RegisterResponse,
} from '../../../domain/models/UserInfo';

export class MockUserInfoRepository implements UserInfoRepository {
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
        onboarding_completed: false,
      },
    };
  }
  async login(email: string, password: string): Promise<LoginResponse> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
      message: 'Mock login successful',
      token: 'mock-jwt-token',
      user: {
        id: 1,
        name: 'Mock User',
        email,
        password,
        onboarding_completed: false,
      },
    };
  }
}
