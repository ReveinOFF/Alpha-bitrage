import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Withdrawals } from './withdrawals.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WithdrawalsService {
  constructor(
    @InjectRepository(Withdrawals)
    private wdRepository: Repository<Withdrawals>,
  ) {}
}
