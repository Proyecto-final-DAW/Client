export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export type RegisterResponse = {
  message: string;
  token: string;
  user: User;
};
