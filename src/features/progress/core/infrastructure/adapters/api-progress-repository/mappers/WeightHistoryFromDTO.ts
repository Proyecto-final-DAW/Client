import { parseLocalDate } from '@shared/utils/date';
import type { Progress } from '@features/progress/core/domain/models/Progress';
import type { GetProgressDTO } from '../dtos/GetProgressDTO';

export class WeightHistoryFromDTO {
  static fromDTO(dto: GetProgressDTO): Progress {
    // Server emits `date` as YYYY-MM-DD via TO_CHAR — parse as
    // local-midnight to avoid the UTC shift that would render
    // yesterday's weight as today's in TZs west of UTC.
    return {
      date: parseLocalDate(dto.date) ?? new Date(dto.date),
      weight: dto.weight,
    };
  }

  static fromDTOList(dtos: GetProgressDTO[]): Progress[] {
    return dtos.map((dto) => WeightHistoryFromDTO.fromDTO(dto));
  }
}
