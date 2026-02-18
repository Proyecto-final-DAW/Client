import type { UserInfoRepository } from '../../../application/ports/UserInfoRepository';
import type { LoginResponse } from '../../../domain/models/UserInfo';

export class MockUserInfoRepository implements UserInfoRepository {
   async login(email: string, password: string): Promise<LoginResponse> {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return {
         message: 'Mock login successful',
         token: 'mock-jwt-token',
         user: {
            id: '1',
            name: 'Mock User',
            email,
            password,
         },
      };
   }
}
