import type {
  ChangePasswordData,
  ProfileData,
  ProfileUpdateData,
} from '../../domain/models/ProfileData';

export interface ProfileRepository {
  getProfile(): Promise<ProfileData>;
  updateProfile(data: ProfileUpdateData): Promise<ProfileData>;
  changePassword(data: ChangePasswordData): Promise<{ message: string }>;
}
