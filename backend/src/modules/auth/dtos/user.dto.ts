import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class Role {
  @Expose()
  @ApiProperty()
  name: string;
}

export class UserDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @Type(() => Role)
  @ApiProperty()
  role: Role;
}
