import { BaseEntity } from 'src/utils/base-entity';
import { HelpType } from 'src/utils/enum';
import { Column, Entity } from 'typeorm';

@Entity()
export class Help extends BaseEntity {
  @Column({
    nullable: false,
  })
  link: string;

  @Column({
    nullable: false,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: HelpType,
    nullable: false,
  })
  type: HelpType;
}
