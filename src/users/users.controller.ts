import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Request,
  Post,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './interfaces/user.interface';
import { Token } from './interfaces/token.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { PasswordUserDto } from './dto/password-user.dto';
import { CreateProfileUserDto } from './dto/create-profile-user.dto';
import { UpdateProfileUserDto } from './dto/update-profile-user.dto';
import { AuthGuard } from './guard/auth.guard';

@Controller('users')
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @Get()
  public async findAll(@Query('email') email?: string): Promise<User[]> {
    return this.usersService.findAll(email);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  public async getProfile(@Request() req: { user: User }) {
    return this.usersService.findOne(req.user.id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('createaccount')
  public async createAccount(
    @Body() createProfileUserDto: CreateProfileUserDto,
  ) {
    return this.usersService.createAccount(createProfileUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Patch('update/:id')
  public async updateProfile(
    @Request() req: { user: User },
    @Body() updateProfileUserDto: UpdateProfileUserDto,
  ) {
    return this.usersService.updateProfile(req.user.id, updateProfileUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Patch('changepassword')
  public async changePassword(
    @Request() req: { user: User },
    @Body() passwordUserDto: PasswordUserDto,
  ): Promise<{ user: User; token: Token }> {
    return this.usersService.changePassword(req.user.id, passwordUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Patch('resetpassword/:id')
  public async resetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() passwordUserDto: PasswordUserDto,
  ): Promise<{ user: User; token: Token }> {
    return this.usersService.changePassword(id, passwordUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  public async delete(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.delete(id);
  }
}
