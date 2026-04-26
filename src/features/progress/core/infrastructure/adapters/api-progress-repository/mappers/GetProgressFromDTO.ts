import type { Progress } from '../../../../domain/models/Progress';
import type { GetProgressDTO } from '../dtos/GetProgressDTO';

export const GetProgressFromDTO = {
  fromDTO(dto: GetProgressDTO): Progress {
    return {
      date: new Date(dto.date),
      weight: dto.weight,
    };
  },

  fromDTOList(dtos: GetProgressDTO[]): Progress[] {
    return dtos.map((dto) => this.fromDTO(dto));
  },
};
