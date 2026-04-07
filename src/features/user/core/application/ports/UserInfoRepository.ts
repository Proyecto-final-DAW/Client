import type {
  LoginResponse,
  RegisterResponse,
} from '../../domain/models/UserInfo';

export interface UserInfoRepository {
  register(
    name: string,
    email: string,
    password: string
  ): Promise<RegisterResponse>;
  login(email: string, password: string): Promise<LoginResponse>;
}
