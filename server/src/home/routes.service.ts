import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Routes } from './routes.entity';
import { Repository } from 'typeorm';
import { TokenDTO } from 'src/authentication/authentication.dto';
import { CreateRoutesDTO } from './routes.dto';
import { User } from 'src/authentication/authentication.entity';
import { Status } from 'src/utils/enum';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Routes)
    private routesRepository: Repository<Routes>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
    const findUser = await this.usersRepository.findOneOrFail({
      where: { id: user.id },
    });

    const create = await this.routesRepository.create({
      ...data,
      user: findUser,
    });

    const save = await this.routesRepository.save(create);

    const res = {
      ...save,
      created: this.formatRelativeDate(new Date(save.createdAt)),
    };

    return res;
  }
}
