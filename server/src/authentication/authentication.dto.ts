import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { User } from './authentication.entity';

export class AuthDTO {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

export class RegDTO extends AuthDTO {
  @IsString()
  @IsOptional()
  referral?: string;
}

export class TokenDTO {
  id: number;
  email: string;
  role: string;
  premium: boolean;
  iat: number;
  exp: number;
}

export class ProfileDTO {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  image: string;

  @Expose()
  premium: boolean;

  @Expose()
  money: string;
}

export class ReferralDTO {
  code: string;
  totalRef: number;
  users: User[];
}

export class ForgotPassDTO {
  newPassword: string;
  token: string;
}
