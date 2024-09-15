import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './interfaces/user.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { PasswordUserDto } from './dto/password-user.dto';
import { CreateProfileUserDto } from './dto/create-profile-user.dto';
import { UpdateProfileUserDto } from './dto/update-profile-user.dto';
import { Token } from './interfaces/token.interface';

@Injectable()
export class UsersService {
  constructor(private readonly jwtService: JwtService) {}

  public async findAll(email?: string): Promise<User[]> {
    if (email) {
      return this.users.filter(el => el.email === email);
    }
    return this.users;
  }

  public async findOne(id: number): Promise<User> {
    return this.users.find(el => el.id === id);
  }

  public async login(loginDto: LoginUserDto): Promise<Token> {
    const user = await this.findOneByEmail(loginDto.email);
    if (!user || user.password != loginDto.password) {
      throw new UnauthorizedException('Invalid login or password');
    }

    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
      password: user.password,
    });
    return {
      access: accessToken,
    };
  }

  public async createAccount(
    createProfileUserDto: CreateProfileUserDto,
  ): Promise<{ user: User; token: Token }> {
    const candidate = await this.findOneByEmail(createProfileUserDto.email);

    if (candidate) {
      throw new UnauthorizedException(
        `User with Email: ${candidate.email} already exists`,
      );
    }

    const newUser = await this.create(createProfileUserDto);
    const accessToken = await this.jwtService.signAsync({
      id: newUser.id,
      email: newUser.email,
      password: newUser.password,
    });
    return {
      user: newUser,
      token: {
        access: accessToken,
      },
    };
  }

  public async updateProfile(
    id: number,
    updateProfileUserDto: UpdateProfileUserDto,
  ): Promise<User> {
    const oldUser: User = await this.findOne(id);
    const modUser: User = { ...oldUser, ...updateProfileUserDto };
    this.users = this.users.map(el => {
      if (el.id === modUser.id) {
        return modUser;
      } else {
        return el;
      }
    });
    return modUser;
  }

  public async changePassword(
    id: number,
    passwordUserDto: PasswordUserDto,
  ): Promise<{ user: User; token: Token }> {
    const oldUser: User = await this.findOne(id);
    const modUser: User = { ...oldUser, ...passwordUserDto };
    this.users = this.users.map(el => {
      if (el.id === modUser.id) {
        return modUser;
      } else {
        return el;
      }
    });

    const token = await this.login({ ...modUser });
    return {
      user: modUser,
      token,
    };
  }

  public async delete(id: number): Promise<User> {
    const deleteUser = await this.findOne(id);
    this.users = this.users.filter(el => el.id !== deleteUser.id);
    return deleteUser;
  }

  private async findOneByEmail(email: string): Promise<User> {
    return this.users.find(el => el.email === email);
  }

  private async create(
    CreateProfileUserDto: CreateProfileUserDto,
  ): Promise<User> {
    const newUser: User = { id: Date.now(), ...CreateProfileUserDto };
    this.users.push(newUser);
    return newUser;
  }

  private users: User[] = [
    {
      id: 1,
      email: 'john@gmail.com',
      password: 'm38rmF$',
      name: {
        firstname: 'john',
        lastname: 'doe',
      },
      address: {
        geolocation: {
          lat: '-37.3159',
          long: '81.1496',
        },
        city: 'kilcoole',
        street: 'new road',
        house: '7682',
        zipcode: '12926-3874',
      },
      phone: '1-570-236-7033',
    },
    {
      id: 2,
      email: 'morrison@gmail.com',
      password: '83r5^_',
      name: {
        firstname: 'david',
        lastname: 'morrison',
      },
      address: {
        geolocation: {
          lat: '-37.3159',
          long: '81.1496',
        },
        city: 'kilcoole',
        street: 'Lovers Ln',
        house: '7267',
        zipcode: '12926-3874',
      },
      phone: '1-570-236-7033',
    },
    {
      id: 3,
      email: 'kevin@gmail.com',
      password: 'kev02937@',
      name: {
        firstname: 'kevin',
        lastname: 'ryan',
      },
      address: {
        geolocation: {
          lat: '40.3467',
          long: '-30.1310',
        },
        city: 'Cullman',
        street: 'Frances Ct',
        house: '86',
        zipcode: '29567-1452',
      },
      phone: '1-567-094-1345',
    },
    {
      id: 4,
      email: 'don@gmail.com',
      password: 'ewedon',
      name: {
        firstname: 'don',
        lastname: 'romer',
      },
      address: {
        geolocation: {
          lat: '50.3467',
          long: '-20.1310',
        },
        city: 'San Antonio',
        street: 'Hunters Creek Dr',
        house: '6454',
        zipcode: '98234-1734',
      },
      phone: '1-765-789-6734',
    },
    {
      id: 5,
      email: 'derek@gmail.com',
      password: 'jklg*_56',
      name: {
        firstname: 'derek',
        lastname: 'powell',
      },
      address: {
        geolocation: {
          lat: '40.3467',
          long: '-40.1310',
        },
        city: 'san Antonio',
        street: 'adams St',
        house: '245',
        zipcode: '80796-1234',
      },
      phone: '1-956-001-1945',
    },
  ];
}
