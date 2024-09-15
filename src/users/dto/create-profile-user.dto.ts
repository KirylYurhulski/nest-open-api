import { LoginUserDto } from './login-user.dto';

export class CreateProfileUserDto extends LoginUserDto {
  name: {
    firstname: string;
    lastname: string;
  };
  address: {
    city: string;
    street: string;
    house: string;
    zipcode: string;
    geolocation: {
      lat: string;
      long: string;
    };
  };
  phone: string;
}
