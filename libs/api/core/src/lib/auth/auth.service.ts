import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import bcrypt from 'bcrypt';

import {
  SignUpDto,
  SignInDto,
  VerificationEmailDto,
  TokenResultDto,
  VerificationEmailQueryDto,
} from './dtos';
import { AuthEvents } from './constants';
import { UserService } from '../user';

import { ERROR_MESSAGES } from '@everfit/api/common';
import { is } from '@everfit/shared/utils';
import { User } from '@everfit/api/entities';
import { AuthConfig } from '@everfit/api/types';
import { InjectAuthConfig } from '@everfit/api/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectAuthConfig() private readonly authConfig: AuthConfig,
    private readonly eventEmitter: EventEmitter2,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(params: SignUpDto) {
    await this.getUserOrThrowError(
      params.email,
      new BadRequestException(params.email, ERROR_MESSAGES.EMAIL_EXIST),
      false,
    );

    const newUser = await this.userService.createUser(params);

    this.eventEmitter.emitAsync(AuthEvents.NewUser, newUser);

    return newUser;
  }

  async signIn(params: SignInDto) {
    const { email, password } = params;

    const user = await this.getUserOrThrowError(
      email,
      new NotFoundException(params.email, ERROR_MESSAGES.USER_NOT_FOUND),
    );
    if (!user.isActive) {
      throw new BadRequestException(email, ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      throw new BadRequestException(
        password,
        ERROR_MESSAGES.PASSWORD_INCORRECT,
      );
    }

    return await this.getToken(user);
  }

  async resendVerificationEmail(params: VerificationEmailDto) {
    const { email } = params;

    const user = await this.getUserOrThrowError(
      email,
      new NotFoundException(params.email, ERROR_MESSAGES.EMAIL_NOT_FOUND),
    );

    this.eventEmitter.emitAsync(AuthEvents.VerifyUser, user);

    return HttpStatus.OK;
  }

  async verifyEmail(params: VerificationEmailQueryDto) {
    const { email, signToken } = params;

    await this.getUserOrThrowError(
      email,
      new NotFoundException(params.email, ERROR_MESSAGES.EMAIL_NOT_FOUND),
    );

    await this.userService.update({ email }, { isActive: true });

    return HttpStatus.OK;
  }

  async deactiavateEmail(params: VerificationEmailQueryDto) {
    const { email, signToken } = params;

    await this.getUserOrThrowError(
      email,
      new NotFoundException(params.email, ERROR_MESSAGES.EMAIL_NOT_FOUND),
    );

    await this.userService.update({ email }, { isActive: false });

    return HttpStatus.OK;
  }

  async getToken(user: User) {
    const accessToken = await this.createAccessToken(user);
    return accessToken;
  }

  async createAccessToken(user: User) {
    const payload = {
      userId: user.id,
      email: user.email,
      isActive: user.isActive,
    };
    const tokenResult = new TokenResultDto();
    tokenResult.token = await this.jwtService.signAsync(payload, {
      secret: this.authConfig.jwtSecret,
      expiresIn: this.authConfig.jwtExpired,
    });
    tokenResult.computeExpiry(this.authConfig.jwtExpired);
    return tokenResult;
  }

  async verifyToken(token: string): Promise<unknown> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.authConfig.jwtSecret,
      });
    } catch (e) {
      throw new InternalServerErrorException(token, 'Error verifying token');
    }
  }

  /**
   * Return the user currently controlled by email or throw error.
   *
   * @param email The email of the the user that the user is handling.
   * @param error Error.
   * @param exist A boolean indicating whether you want to check the user is exist or not. Default: true.
   *
   * @throws {Error} If user is not compatible with `exist` param.
   */
  async getUserOrThrowError(email: string, error?: Error, exist = true) {
    const user = await this.userService.findByEmail(email);
    await this.checkExistUser(user, email, error, exist);
    return user;
  }

  async checkExistUser(
    user: User | string,
    email: string,
    error?: Error,
    exist = true,
  ) {
    if (exist && is.nil(user)) {
      if (error instanceof Error) {
        throw error;
      }
      throw new NotFoundException(email, ERROR_MESSAGES.EMAIL_NOT_FOUND);
    }
    if (!exist && is.notNil(user)) {
      if (error instanceof Error) {
        throw error;
      }
      throw new BadRequestException(email, ERROR_MESSAGES.EMAIL_EXIST);
    }
  }
}
