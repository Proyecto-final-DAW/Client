import type { Session } from '@features/sessionHistory/core/domain/models/Session';
import { parseLocalDate } from '@shared/utils/date';

import type { SessionDTO } from '../dtos/GetSessionDTO';

export class SessionsFromDTO {
  static fromDTO(dto: SessionDTO): Session {
    // `dto.date` is a YYYY-MM-DD string from the server's `DATE`
    // column; parse as local-midnight so "is this session today?"
    // checks downstream resolve correctly in any TZ. `created_at` is
    // a full ISO timestamp — Date can parse it natively.
    const localDate = parseLocalDate(dto.date) ?? new Date(dto.date);
    return {
      id: String(dto.id),
      userId: String(dto.user_id),
      routineId: dto.routine_id !== null ? String(dto.routine_id) : null,
      date: localDate,
      notes: null,
      createdAt: new Date(dto.created_at),
    };
  }

  static fromDTOList(dtos: SessionDTO[]): Session[] {
    return dtos.map(SessionsFromDTO.fromDTO);
  }
}
