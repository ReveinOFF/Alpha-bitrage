import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenDTO } from 'src/authentication/authentication.dto';
import { User } from 'src/authentication/authentication.entity';
import { Help } from 'src/help/help.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { StatusWD } from 'src/utils/enum';
import { Withdrawals } from 'src/withdrawals/withdrawals.entity';
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
    private readonly nfService: NotificationsService,
  ) {}

  async getMenu(tokenData: TokenDTO) {
    const user = await this.usersRepository.findOne({
      where: { id: tokenData.id },
    });

    return {
      image: user.image,
      name: user.name,
    };
  }

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
    const notif = await this.nfService.getAllNf();

    const notifConv = notif.map(
      (item) => `${item.user.name} ${item.htmlContent}`,
    );

    return {
      userCount: userCount,
      totalDeposit: parseFloat(totalDeposit.sum),
      totalWithdraw: parseFloat(totalWD.sum) || 0,
      premiumCount: premiumCount,
      notifications: notifConv,
    };
  }

  async createAnn(data) {
    const ann = await this.helpRepository.create(data);

    return await this.helpRepository.save(ann);
  }

  async deleteAnn(id: number) {
    return await this.helpRepository.delete({ id });
  }

  async getAllWd() {
    const wd = await this.wdRepository.find({
      where: { status: StatusWD.PENDING },
      relations: ['user'],
    });

    return wd;
  }

  async updateWd(data) {
    return await this.wdRepository.update(data.id, { status: data.status });
  }

  async getAllUsers() {
    return await this.usersRepository.find({
      relations: ['routes', 'withdrawals'],
    });
  }
}
