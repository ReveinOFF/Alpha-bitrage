import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Help } from './help.entity';
import { Repository } from 'typeorm';
import { HelpType } from 'src/utils/enum';

@Injectable()
export class HelpService {
  constructor(
    @InjectRepository(Help)
    private helpRepository: Repository<Help>,
  ) {}

  async getAnn() {
    const ann = await this.helpRepository.find({
      where: { type: HelpType.ANNOUNCEMENTS },
    });

    if (!ann) {
      throw new HttpException('Announcements not found', HttpStatus.NOT_FOUND);
    }

    return ann;
  }

  async getGuide() {
    const guides = await this.helpRepository.find({
      where: { type: HelpType.GUIDES },
    });

    if (!guides) {
      throw new HttpException('Guides not found', HttpStatus.NOT_FOUND);
    }

    return guides;
  }

  async search(text: string) {
    const search = await this.helpRepository
      .createQueryBuilder('help')
      .where('LOWER(help.title) LIKE LOWER(:text)', { text: `%${text}%` })
      .getMany();

    if (!search) {
      throw new HttpException('Guides not found', HttpStatus.NOT_FOUND);
    }

    return search;
  }
}
