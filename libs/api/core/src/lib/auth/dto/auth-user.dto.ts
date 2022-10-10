import { IsNotEmpty, IsString } from 'class-validator';

import { BaseDto } from '@everfit/api/common';

export class AuthUserDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  email: string;
}
