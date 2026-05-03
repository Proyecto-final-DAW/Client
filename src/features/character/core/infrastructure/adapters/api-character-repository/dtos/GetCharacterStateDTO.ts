/**
 * Wire-format DTOs for `GET /character/state` and `POST /character/choose`.
 * These describe what the server actually emits — they intentionally do NOT
 * import domain types so the wire contract stays decoupled from the model.
 *
 * `unknown` for nested objects forces the mapper to validate before promoting
 * to domain types, which is where bad/missing data gets caught.
 */

export interface PendingChoiceDTO {
  tier: 1 | 2 | 3;
  options: ReadonlyArray<Record<string, unknown>>;
  recommendedId: string;
}

export interface CharacterStateDTO {
  currentTier: number;
  heroLevel: number;
  novice: Record<string, unknown>;
  vocation: Record<string, unknown> | null;
  specialization: Record<string, unknown> | null;
  legendary: Record<string, unknown> | null;
  legendaryStage: string | null;
  isMaestroSupremo: boolean;
  isLeyenda: boolean;
  pendingChoice: PendingChoiceDTO | null;
}

export interface OnboardingRequiredDTO {
  requiresOnboarding: true;
}

export type GetCharacterStateDTO = CharacterStateDTO | OnboardingRequiredDTO;

export const isOnboardingRequired = (
  dto: GetCharacterStateDTO
): dto is OnboardingRequiredDTO =>
  (dto as OnboardingRequiredDTO).requiresOnboarding === true;
