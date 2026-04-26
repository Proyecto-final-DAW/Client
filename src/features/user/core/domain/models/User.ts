export interface User {
  name: string;
  email: string;
  password: string;
}

export type RegisterResponse = {
  message?: string;
};
