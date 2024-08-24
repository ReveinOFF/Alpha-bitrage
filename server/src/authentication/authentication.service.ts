import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken, User } from './authentication.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  AuthDTO,
  // ForgotPassDTO,
  ProfileDTO,
  ReferralDTO,
  RegDTO,
  TokenDTO,
} from './authentication.dto';
import { plainToClass } from 'class-transformer';
import { NotificationsService } from 'src/notifications/notifications.service';
// import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthenticationService {
  // private transporter;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly nfService: NotificationsService,
  ) {
    // this.transporter = nodemailer.createTransport({
    //   host: 'smtp.example.com',
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: 'your-email@example.com',
    //     pass: 'your-email-password',
    //   },
    // });
  }

  // async sendMail(to: string, subject: string, text: string, html?: string) {
  //   const mailOptions = {
  //     from: 'your-email@example.com',
  //     to,
  //     subject,
  //     text,
  //     html,
  //   };

  //   return this.transporter.sendMail(mailOptions);
  // }

  private async createRefreshToken(
    user: User,
  ): Promise<{ refreshToken: string; token: string }> {
    const refTok = await this.generateRefToken(user.id);

    const refreshToken = await this.refreshTokenRepository.create({
      user,
      token: refTok,
      createdAt: new Date(),
      expiresAt: this.calculateExpiryDate(),
    });

    await this.refreshTokenRepository.save(refreshToken);

    const token = await this.createToken(user);

    return { refreshToken: refTok, token: token };
  }

  private async generateRefToken(id: number): Promise<string> {
    const uniqueString = `${id}-${Date.now()}`;

    return await bcrypt.hash(uniqueString, 10);
  }

  private calculateExpiryDate(): Date {
    const expiresIn = 60 * 60 * 24 * 7;
    return new Date(Date.now() + expiresIn * 1000);
  }

  private async generateReferralCode(email: string): Promise<string> {
    const uniqueString = `${email}-${Date.now()}`;

    return await bcrypt.hash(uniqueString, 10);
  }

  private async createToken(user: User) {
    const token = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
      role: user.role,
      premium: user.premium,
    });

    return token;
  }

  // ---------------------

  async registration(
    dto: RegDTO,
  ): Promise<{ refreshToken: string; token: string }> {
    const { email, password, referral } = dto;

    const isUserCreated = await this.usersRepository.findOne({
      where: { email },
    });

    if (isUserCreated) {
      throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const ref = await this.generateReferralCode(email);
    const referrer = referral
      ? await this.usersRepository.findOne({
          where: { referralCode: referral },
          relations: ['referredUsers'],
        })
      : null;

    const newUser = await this.usersRepository.create({
      email,
      referralCode: ref,
      referredBy: referrer,
      password: hashPassword,
      name: dto.email.split('@')[0],
    });

    await this.usersRepository.save(newUser);

    await this.nfService.createNf({
      user: { id: newUser.id },
      htmlContent: `has just registered.`,
    });

    const refreshToken = await this.createRefreshToken(newUser);

    return refreshToken;
  }

  async login(dto: AuthDTO): Promise<{ refreshToken: string; token: string }> {
    const { email, password } = dto;

    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isAuth = await bcrypt.compare(password, user.password);

    if (!isAuth) {
      throw new HttpException('Incorrect password', HttpStatus.FORBIDDEN);
    }

    const refreshToken = await this.createRefreshToken(user);

    return refreshToken;
  }

  async refreshToken(
    refToken: string,
  ): Promise<{ refreshToken: string; token: string }> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: refToken },
      relations: ['user'],
    });

    if (!refreshToken) {
      throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
    }

    const token = await this.createRefreshToken(refreshToken.user);

    await this.refreshTokenRepository.delete({ id: refreshToken.id });

    return token;
  }

  async logout(refToken: string) {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: refToken },
    });

    if (!refreshToken) {
      throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
    }

    return await this.refreshTokenRepository.delete({ id: refreshToken.id });
  }

  // async changePass(email: string) {
  //   const user = await this.usersRepository.findOne({ where: { email } });

  //   if (!user) {
  //     throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //   }

  //   const token = await this.createToken(user);

  //   return this.sendMail(email, 'Forget password', token);
  // }

  // async changePassConfirm(dto: ForgotPassDTO) {
  //   const { id } = this.jwtService.decode<TokenDTO>(dto.token);

  //   const user = await this.usersRepository.findOne({ where: { id } });

  //   const hashPassword = await bcrypt.hash(dto.newPassword, 10);

  //   user.password = hashPassword;

  //   await this.usersRepository.save(user);
  // }

  async getProfile(tokenData: TokenDTO): Promise<ProfileDTO> {
    const user = await this.usersRepository.findOne({
      where: { id: tokenData.id },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return plainToClass(ProfileDTO, user, { excludeExtraneousValues: true });
  }

  async getReferral(tokenData: TokenDTO): Promise<ReferralDTO> {
    const user = await this.usersRepository.findOne({
      where: { id: tokenData.id },
      relations: ['referredUsers'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      code: user.referralCode,
      totalRef: user.referredUsers.length,
      users: user.referredUsers,
    };
  }
}
