import type { UserInfo } from '../../../../domain/models/UserInfo';
import type { GetUserInfoDTO } from '../dtos/GetUserInfoDTO';

export class UserInfoFromDTO {
   static fromDTO(dto: GetUserInfoDTO): UserInfo {
      return {
         id: dto.id,
         name: dto.name,
         email: dto.email,
         password: dto.password,
      };
   }
}
