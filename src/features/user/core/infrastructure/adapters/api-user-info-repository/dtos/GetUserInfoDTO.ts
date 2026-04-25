export interface GetUserInfoDTO {
  id: number;
  name: string;
  email: string;
  onboarding_completed: boolean;
  profileImage?: string | null;
}
