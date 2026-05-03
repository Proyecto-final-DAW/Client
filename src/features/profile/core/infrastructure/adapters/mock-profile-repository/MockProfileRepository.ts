import type { ProfileRepository } from '../../../application/ports/ProfileRepository';
import type {
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
  goals: ['GAIN_MUSCLE'],
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
  async getProfile(): Promise<ProfileData> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return MOCK_PROFILE;
  }

  async updateProfile(data: ProfileUpdateData): Promise<ProfileData> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { ...MOCK_PROFILE, ...data };
  }

  async changePassword(): Promise<{ message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { message: 'Contraseña actualizada correctamente' };
  }
}
