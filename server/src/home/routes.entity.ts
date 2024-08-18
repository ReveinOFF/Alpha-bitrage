import { User } from 'src/authentication/authentication.entity';
import { BaseEntity } from 'src/utils/base-entity';
import { Status } from 'src/utils/enum';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Routes extends BaseEntity {
  @Column({
    nullable: false,
  })
  exchangeFrom: string;

  @Column({
    nullable: false,
  })
  exchangeTo: string;

  @Column({
    type: 'decimal',
    default: 0.0,
    nullable: false,
  })
  buyPrice: string;

  @Column({
    type: 'decimal',
    default: 0.0,
    nullable: false,
  })
  sellPrice: string;

  @Column({
    type: 'decimal',
    default: 0.0,
    nullable: false,
  })
  spread: string;

  @Column({
    nullable: false,
  })
  quantity: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
    nullable: false,
  })
  status: Status;

  @Column({
    type: 'decimal',
    default: 0.0,
    nullable: false,
  })
  profit: string;

  @ManyToOne(() => User, (user) => user.routes, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  user?: User;
}
