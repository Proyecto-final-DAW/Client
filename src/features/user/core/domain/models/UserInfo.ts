export interface UserInfo {
  id: number;
  name: string;
  email: string;
  password: string;
  onboarding_completed: boolean;
  profileImage?: string;
}

export type RegisterResponse = {
  message: string;
  token: string;
  user: UserInfo;
};

export type LoginResponse = {
  message: string;
  token: string;
  user: UserInfo;
};
