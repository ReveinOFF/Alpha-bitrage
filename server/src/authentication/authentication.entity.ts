import { Routes } from 'src/home/routes.entity';
import { Notification } from 'src/notifications/notifications.entity';
import { BaseEntity } from 'src/utils/base-entity';
import { Role } from 'src/utils/enum';
import { Withdrawals } from 'src/withdrawals/withdrawals.entity';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';

@Index(['email', 'referralCode'])
@Entity()
export class User extends BaseEntity {
  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'boolean', default: false })
  confirm: boolean;

  @Column({ type: 'boolean', default: false })
  premium: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  premiumAdd: Date;

  @Column({ type: 'timestamptz', nullable: true })
  premiumEnd: Date;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 3,
    default: 0.0,
    nullable: false,
  })
  money: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 3,
    default: 0.0,
    nullable: false,
  })
  deposited: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 3,
    default: 0.0,
    nullable: false,
  })
  earnings: string;

  @Column({ unique: true, nullable: false })
  referralCode: string;

  @OneToMany(() => User, (user) => user.referredBy)
  referredUsers: User[];

  @ManyToOne(() => User, (user) => user.referredUsers, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  referredBy?: User;

  @OneToMany(() => RefreshToken, (ref) => ref.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  refreshTokens: RefreshToken[];

  @OneToMany(() => Routes, (rout) => rout.user)
  routes: User[];

  @OneToMany(() => Notification, (nf) => nf.user)
  notifications: Notification[];

  @OneToMany(() => Deposit, (d) => d.user)
  deposites: Deposit[];

  @OneToMany(() => Withdrawals, (wd) => wd.user)
  withdrawals: Withdrawals[];

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
    nullable: false,
  })
  role: Role;
}

@Index(['token'])
@Entity('refresh_tokens')
export class RefreshToken extends BaseEntity {
  @Column({ name: 'expires_at', type: 'timestamp', nullable: false })
  expiresAt: Date;

  @Column({ unique: true })
  token: string;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;
}

@Entity()
export class Deposit extends BaseEntity {
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 3,
    default: 0.0,
    nullable: false,
  })
  money: string;

  @ManyToOne(() => User, (user) => user.deposites)
  user: User;
}
