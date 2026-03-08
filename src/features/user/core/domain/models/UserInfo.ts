export interface UserInfo {
  id: number;
  name: string;
  email: string;
  password: string;
  onboarding_completed: boolean;
}

export type LoginResponse = {
  message: string;
  token: string;
  user: UserInfo;
};
