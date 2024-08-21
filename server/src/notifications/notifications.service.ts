import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notifications.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private nfRepository: Repository<Notification>,
  ) {}

  async createNf(data) {
    const nf = await this.nfRepository.create(data);

    return await this.nfRepository.save(nf);
  }

  async getAllNf() {
    return await this.nfRepository.find({ relations: ['user'] });
  }
}
