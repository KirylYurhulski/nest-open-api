import { IsEmail, IsNotEmpty } from 'class-validator';
import { PasswordUserDto } from './password-user.dto';

export class LoginUserDto extends PasswordUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
