import type { UserInfo } from '../../../../../shared/core/domain/models/UserInfo';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export type RegisterResponse = {
  message?: string;
  user?: UserInfo;
};
