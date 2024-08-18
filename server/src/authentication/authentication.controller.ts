import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { JwtAuthGuard } from './authentication.guard';
import { AuthDTO, RegDTO } from './authentication.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  async registration(@Body() regDto: RegDTO) {
    return await this.authService.registration(regDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthDTO) {
    return await this.authService.login(loginDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body('refreshToken') refreshToken: string) {
    return await this.authService.logout(refreshToken);
  }

  @Get('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Query('token') refreshToken: string) {
    return await this.authService.refreshToken(refreshToken);
  }

  // @Post('forgot-pass')
  // @HttpCode(HttpStatus.ACCEPTED)
  // async changePass(@Body() email: string) {
  //   return await this.authService.changePass(email);
  // }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req) {
    return await this.authService.getProfile(req.user);
  }

  @Get('referral')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getReferral(@Request() req) {
    return await this.authService.getReferral(req.user);
  }
}
