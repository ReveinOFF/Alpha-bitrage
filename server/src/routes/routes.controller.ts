import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/authentication.guard';
import { RoutesService } from './routes.service';
import { CreateRoutesDTO } from './routes.dto';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get('main')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMainRoutes() {
    return await this.routesService.getMainRoutes();
  }

  @Get('execution')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getExecutionRoutes(@Request() req) {
    return await this.routesService.getExecutionRoutes(req.user);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createRoutes(@Request() req, @Body() data: CreateRoutesDTO) {
    return await this.routesService.createRouter(data, req.user);
  }
}
