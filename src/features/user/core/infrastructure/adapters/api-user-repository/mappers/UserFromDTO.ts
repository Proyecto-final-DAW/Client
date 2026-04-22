import type { User } from '../../../../domain/models/User';
import type { GetUserDTO } from '../dtos/GetUserDTO';

export class UserFromDTO {
  static fromDTO(dto: GetUserDTO): User {
    return {
      id: dto.id,
      name: dto.name,
      email: dto.email,
      password: dto.password,
    };
  }
}
