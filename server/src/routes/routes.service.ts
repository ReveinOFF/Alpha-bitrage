import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ButtonClick, Routes } from './routes.entity';
import { MoreThan, Repository } from 'typeorm';
import { TokenDTO } from 'src/authentication/authentication.dto';
import { CreateRoutesDTO } from './routes.dto';
import { Status } from 'src/utils/enum';
import { SchedulerRegistry } from '@nestjs/schedule';
import { NotificationsService } from 'src/notifications/notifications.service';
import { User } from 'src/authentication/authentication.entity';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Routes)
    private routesRepository: Repository<Routes>,
    @InjectRepository(ButtonClick)
    private buttonClickRepository: Repository<ButtonClick>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private schedulerRegistry: SchedulerRegistry,
    private readonly nfService: NotificationsService,
  ) {}

  private async getData() {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'src',
      'utils',
      'trades.json',
    );
    const jsonData = await fs.readFile(filePath, { encoding: 'utf-8' });

    if (!jsonData) {
      throw new HttpException('Routes not found', HttpStatus.NOT_FOUND);
    }

    return JSON.parse(jsonData);
  }

  private formatRelativeDate(inputDate) {
    const now = new Date().getTime();
    const inputTime = inputDate.getTime();
    const diff = now - inputTime;
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`;
    } else if (diffWeeks <= 4) {
      return `${diffWeeks} weeks ago`;
    } else if (diffDays <= 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
  }

  private async getRoutesWithSpread() {
    const routes = await this.routesRepository.query(`
    SELECT 
      "exchangeFrom",
      "exchangeTo",
      "buyPrice",
      "sellPrice",
      spread,
      COUNT(*) as frequency
    FROM 
      routes
    GROUP BY 
      "exchangeFrom",
      "exchangeTo",
      "buyPrice",
      "sellPrice",
      spread
    ORDER BY 
      frequency DESC;
  `);

    return routes.map((item) => ({
      ...item,
      spread: Math.floor(item.spread * 10) / 10,
    }));
  }

  private filterPremium(data) {
    return data.filter((item) => item.spread >= 1.5 && item.spread <= 2.5);
  }

  private getTopMin(updatedData, data, count) {
    let topMin = updatedData.slice(-count);

    if (topMin.length < count) {
      topMin = this.addAdditionalData(topMin, data, updatedData, count);
    }

    return topMin;
  }

  private getTop(updatedData, data, count) {
    let top = updatedData;

    if (top.length < count) {
      top = this.addAdditionalData(top, data, updatedData, count);
    }

    return top;
  }

  private addAdditionalData(top, data, updatedData, count) {
    const sortedData = data.sort((a, b) => b.spread - a.spread);

    const filteredData = sortedData.filter(
      (item) =>
        !updatedData.some(
          (existingItem) =>
            existingItem.exchangeFrom === item.exchangeFrom &&
            existingItem.exchangeTo === item.exchangeTo &&
            existingItem.buyPrice === item.buyPrice &&
            existingItem.sellPrice === item.sellPrice &&
            existingItem.spread === item.spread,
        ),
    );

    const remainingSlots = count - top.length;
    const additionalData = filteredData.slice(0, remainingSlots);
    return [...top, ...additionalData];
  }

  private scheduleTaskForRouter(routerId: number) {
    const timeout = setTimeout(
      async () => {
        const router = await this.routesRepository.findOne({
          where: { id: routerId },
        });

        if (router) {
          const profit = router.quantity * (parseFloat(router.spread) / 100);

          const profitAfterCommission = profit - profit * 0.05;

          router.status = Status.SUCCESS;
          router.profit = profitAfterCommission.toString();
          router.user.earnings = profitAfterCommission.toString();
          router.user.earnings = (
            parseFloat(router.user.earnings) +
            router.quantity +
            profitAfterCommission
          ).toString();
          router.user.money = (
            parseFloat(router.user.money) + profitAfterCommission
          ).toString();

          await this.routesRepository.save(router);
        }
      },
      3 * 60 * 60 * 1000,
    );

    this.schedulerRegistry.addTimeout(`task-${routerId}`, timeout);
  }

  private async handleButtonClick(userId: number): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let click = await this.buttonClickRepository.findOne({
      where: {
        user: { id: userId },
        createdAt: MoreThan(today),
      },
    });

    if (click && click.clickCount >= 3) {
      throw new HttpException(
        'You can only click the button 3 times a day',
        HttpStatus.CONFLICT,
      );
    }

    if (!click) {
      click = this.buttonClickRepository.create({
        user: { id: userId },
        clickCount: 1,
      });
    } else {
      click.clickCount += 1;
    }

    await this.buttonClickRepository.save(click);
  }

  //   -------------

  async getMainRoutes() {
    const data = await this.getData();
    const updatedData = await this.getRoutesWithSpread();

    const premium = this.filterPremium(data);
    let topMin = this.getTopMin(updatedData, data, 3);
    let top = this.getTop(updatedData, data, 5);

    return {
      new: data.slice(-3),
      topMin: topMin,
      premiumMin: premium.sort((a, b) => b.spread - a.spread).slice(0, 3),
      all: data,
      top: top,
      premium: premium,
    };
  }

  async getExecutionRoutes(user: TokenDTO) {
    const data = await this.getData();
    const updatedData = await this.getRoutesWithSpread();

    let routersUser = await this.routesRepository.find({
      where: { user: { id: user.id } },
    });

    const routersHist = routersUser
      .filter((item) => item.status !== Status.PENDING)
      .map((item) => ({
        ...item,
        created: this.formatRelativeDate(new Date(item.createdAt)),
      }));
    const routersOpen = routersUser
      .filter((item) => item.status == Status.PENDING)
      .map((item) => ({
        ...item,
        created: this.formatRelativeDate(new Date(item.createdAt)),
      }));

    const premium = this.filterPremium(data);
    let top = this.getTop(updatedData, data, 5);

    return {
      all: data,
      top: top,
      premium: premium,
      history: routersHist,
      open: routersOpen,
    };
  }

  async createRouter(data: CreateRoutesDTO, user: TokenDTO) {
    const usr = await this.userRepository.findOne({ where: { id: user.id } });

    if (parseFloat(usr.money) < data.quantity)
      throw new HttpException(
        'You dont have the right amount of money',
        HttpStatus.CONFLICT,
      );

    await this.handleButtonClick(user.id);

    const create = await this.routesRepository.create({
      ...data,
      user: usr,
    });

    const save = await this.routesRepository.save(create);

    usr.money = (parseFloat(usr.money) - save.quantity).toString();

    await this.nfService.createNf({
      user: { id: user.id },
      htmlContent: `has submitted a trade request for <strong>$${save.quantity}</strong>`,
    });

    this.scheduleTaskForRouter(save.id);

    const res = {
      ...save,
      created: this.formatRelativeDate(new Date(save.createdAt)),
    };

    return res;
  }
}
