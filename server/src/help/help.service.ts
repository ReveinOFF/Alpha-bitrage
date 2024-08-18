import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Help } from './help.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HelpService {
  constructor(
    @InjectRepository(Help)
    private helpRepository: Repository<Help>,
  ) {}

  async getAnn() {}

  async getGuide() {}
}
