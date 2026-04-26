import type { Progress } from '../../../../domain/models/Progress';
import type { GetProgressDTO } from '../dtos/GetProgressDTO';

export class WeightHistoryFromDTO {
  static fromDTO(dto: GetProgressDTO): Progress {
    return {
      date: new Date(dto.date),
      weight: dto.weight,
    };
  }

  static fromDTOList(dtos: GetProgressDTO[]): Progress[] {
    return dtos.map((dto) => WeightHistoryFromDTO.fromDTO(dto));
  }
}
