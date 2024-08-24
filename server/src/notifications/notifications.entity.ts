import { User } from 'src/authentication/authentication.entity';
import { BaseEntity } from 'src/utils/base-entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Notification extends BaseEntity {
  @Column({
    nullable: false,
  })
  htmlContent: string;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;
}
