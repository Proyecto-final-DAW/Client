export interface UserInfo {
  id: string;
  name: string;
  email: string;
  password: string;
}

export type LoginResponse = {
  message: string;
  token: string;
  user: UserInfo;
};
