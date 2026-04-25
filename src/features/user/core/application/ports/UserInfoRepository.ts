import type { LoginResponse } from '../../../../../shared/core/domain/models/UserInfo';

export interface UserInfoRepository {
  login(email: string, password: string): Promise<LoginResponse>;
}
