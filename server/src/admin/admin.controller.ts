import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAdminGuard } from 'src/authentication/authentication.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('menu-info')
  @UseGuards(JwtAdminGuard)
  @HttpCode(HttpStatus.OK)
  async getMenuInf(@Request() req) {
    return await this.adminService.getMenu(req.user);
  }

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

  @Get('all-wd')
  @UseGuards(JwtAdminGuard)
  @HttpCode(HttpStatus.OK)
  async getAllWd() {
    return await this.adminService.getAllWd();
  }

  @Put('update-wd')
  @UseGuards(JwtAdminGuard)
  @HttpCode(HttpStatus.OK)
  async updateWd(@Body() data) {
    return await this.adminService.updateWd(data);
  }

  @Get('all-users')
  @UseGuards(JwtAdminGuard)
  @HttpCode(HttpStatus.OK)
  async getAllUsers() {
    return await this.adminService.getAllUsers();
  }

  @Get('user')
  @UseGuards(JwtAdminGuard)
  @HttpCode(HttpStatus.OK)
  async getUser(@Query('q') id: number) {
    return await this.adminService.getUser(id);
  }
}
