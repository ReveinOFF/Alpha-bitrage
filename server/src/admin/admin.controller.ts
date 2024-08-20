import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAdminGuard } from 'src/authentication/authentication.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('main-info')
  @UseGuards(JwtAdminGuard)
  @HttpCode(HttpStatus.OK)
  async getMainInf() {
    return await this.adminService.getMainInf();
  }

  @Post('create-ann')
  @UseGuards(JwtAdminGuard)
  @HttpCode(HttpStatus.OK)
  async createAnn(@Body() data) {
    return await this.adminService.createAnn(data);
  }

  @Delete('delete-ann/:id')
  @UseGuards(JwtAdminGuard)
  @HttpCode(HttpStatus.OK)
  async deleteAnn(@Param('id') id: number) {
    return await this.adminService.deleteAnn(id);
  }
}
