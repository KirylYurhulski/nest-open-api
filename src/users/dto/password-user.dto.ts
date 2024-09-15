import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordUserDto {
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
