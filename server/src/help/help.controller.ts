import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HelpService } from './help.service';
import { JwtAuthGuard } from 'src/authentication/authentication.guard';

@Controller('help')
export class HelpController {
  constructor(private readonly helpService: HelpService) {}

  @Get('announce')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getAnn() {
    return await this.helpService.getAnn();
  }

  @Get('guide')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getGuide() {
    return await this.helpService.getGuide();
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async search(@Query('text') text: string) {
    return await this.helpService.search(text);
  }
}
