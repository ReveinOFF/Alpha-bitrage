import { User } from 'src/authentication/authentication.entity';
import { BaseEntity } from 'src/utils/base-entity';
import { StatusWD } from 'src/utils/enum';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Withdrawals extends BaseEntity {
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 3,
    default: 0.0,
    nullable: false,
  })
  money: string;

  @Column({
    type: 'enum',
    enum: StatusWD,
    default: StatusWD.PENDING,
    nullable: false,
  })
  status: StatusWD;

  @ManyToOne(() => User, (user) => user.withdrawals)
  user: User;
}
