import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/users.dto';
import {
  comparePasswords,
  hashPassword,
} from 'src/module/common/utils/password.util';
import { ResponseData } from 'src/module/common/dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const hashedPassword = await hashPassword(createUserDto.password);
    const resUser = await this.usersService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
    if (resUser.status) {
      const payload = { email: resUser?.data?.email, sub: resUser?.data?.id };
      return {
        message: 'Sign up was successful',
        status: true,
        data: {
          accessToken: this.jwtService.sign(payload),
          user: resUser.data,
        },
      };
    } else {
      return resUser;
    }
  }

  async login(email: string, password: string): Promise<ResponseData> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user || !(await comparePasswords(password, user.password))) {
      throw new UnauthorizedException({
        message: 'Invalid email or password',
        status: false,
      });
    }
    const payload = { email: user.email, sub: user.id };
    delete user.password;
    return {
      message: 'Login successful',
      status: true,
      data: {
        accessToken: this.jwtService.sign(payload),
        user,
      },
    };
  }
}
