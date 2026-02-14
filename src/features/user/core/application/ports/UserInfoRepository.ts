import type { LoginResponse } from "../../domain/models/UserInfo";

export interface UserInfoRepository {
  login(email: string, password: string): Promise<LoginResponse>;
}
