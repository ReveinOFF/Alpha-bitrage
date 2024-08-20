import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/authentication/authentication.entity';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getMainInf() {
    const userCount = await this.usersRepository.count();
    const premiumCount = await this.usersRepository.count({
      where: { premium: true },
    });
    const totalDeposit = await this.usersRepository
      .createQueryBuilder('user')
      .select('SUM(user.deposited)', 'sum')
      .getRawOne();

    return {
      userCount: userCount,
      totalDeposit: totalDeposit,
      totalWithdraw: 423,
      premiumCount: premiumCount,
    };
  }
}
