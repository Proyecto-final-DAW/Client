import type { ProfileRepository } from '../../../application/ports/ProfileRepository';
import type {
  ChangePasswordData,
  ProfileData,
  ProfileUpdateData,
} from '../../../domain/models/ProfileData';

const MOCK_PROFILE: ProfileData = {
  id: 1,
  name: 'Guerrero',
  email: 'guerrero@gym.com',
  age: 25,
  birth_date: '2001-03-15',
  sex: 'MALE',
  weight: 78,
  height: 178,
  activity_level: 'ACTIVE',
  goal: 'GAIN_MUSCLE',
  sleep_hours: 8,
  daily_calories: 2800,
  protein_grams: 156,
  fat_grams: 78,
  carb_grams: 350,
  onboarding_completed: true,
  created_at: '2025-01-15T10:00:00Z',
  updated_at: '2025-04-01T12:00:00Z',
  streak: 12,
  best_streak: 21,
  total_sessions: 84,
};

export class MockProfileRepository implements ProfileRepository {
  async getProfile(_token: string): Promise<ProfileData> {
    return { ...MOCK_PROFILE };
  }

  async updateProfile(
    _token: string,
    data: ProfileUpdateData
  ): Promise<ProfileData> {
    return { ...MOCK_PROFILE, ...data } as ProfileData;
  }

  async changePassword(
    _token: string,
    _data: ChangePasswordData
  ): Promise<{ message: string }> {
    return { message: 'Password updated successfully' };
  }
}
