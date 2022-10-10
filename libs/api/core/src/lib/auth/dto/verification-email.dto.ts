import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class VerificationEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class VerificationEmailQueryDto extends VerificationEmailDto {
  @IsNotEmpty()
  @IsString()
  signToken: string;
}
