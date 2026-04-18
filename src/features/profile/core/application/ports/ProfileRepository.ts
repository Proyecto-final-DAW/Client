import type {
  ChangePasswordData,
  ProfileData,
  ProfileUpdateData,
} from '../../domain/models/ProfileData';

export interface ProfileRepository {
  getProfile(token: string): Promise<ProfileData>;
  updateProfile(token: string, data: ProfileUpdateData): Promise<ProfileData>;
  changePassword(
    token: string,
    data: ChangePasswordData
  ): Promise<{ message: string }>;
}
