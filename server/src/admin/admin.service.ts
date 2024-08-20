import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, Withdrawals } from 'src/authentication/authentication.entity';
import { Help } from 'src/help/help.entity';
import { StatusWD } from 'src/utils/enum';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Help)
    private helpRepository: Repository<Help>,
    @InjectRepository(Withdrawals)
    private wdRepository: Repository<Withdrawals>,
  ) {}

  async getMainInf() {
    const userCount = await this.usersRepository.count();
    const premiumCount = await this.usersRepository.count({
      where: { premium: true },
    });
    const totalDeposit = await this.usersRepository
      .createQueryBuilder('user')
      .select('SUM(user.deposited)')
      .getRawOne();
    const totalWD = await this.wdRepository
      .createQueryBuilder('withdrawals')
      .select('SUM(withdrawals.money)')
      .where('withdrawals.status = :status', { status: StatusWD.PENDING })
      .getRawOne();

    return {
      userCount: userCount,
      totalDeposit: parseFloat(totalDeposit.sum),
      totalWithdraw: parseFloat(totalWD.sum) || 0,
      premiumCount: premiumCount,
    };
  }

  async createAnn(data) {
    const ann = await this.helpRepository.create(data);

    return await this.helpRepository.save(ann);
  }

  async deleteAnn(id: number) {
    return await this.helpRepository.delete({ id });
  }
}
