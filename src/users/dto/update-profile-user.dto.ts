export class UpdateProfileUserDto {
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
