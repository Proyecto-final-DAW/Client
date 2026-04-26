import type { Milestone } from '../../../../domain/models/Milestone';
import type {
  GetAllMilestonesDTO,
  GetUnlockedMilestonesDTO,
} from '../dtos/GetMilestonesDTO';

export interface MilestonesDTO {
  all: GetAllMilestonesDTO;
  unlocked: GetUnlockedMilestonesDTO;
}

export class MilestonesFromDTO {
  static fromDTO(dto: MilestonesDTO): Milestone[] {
    const unlockedById = new Map(
      dto.unlocked.map((u) => [u.id, u.unlocked_at])
    );

    return dto.all.map((m) => {
      const unlockedAt = unlockedById.get(m.id) ?? null;
      return {
        id: m.id,
        name: m.name,
        description: m.description,
        conditionType: m.condition_type,
        conditionValue: m.condition_value,
        icon: m.icon,
        unlocked: unlockedAt !== null,
        unlockedAt,
      };
    });
  }
}
