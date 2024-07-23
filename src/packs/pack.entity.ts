import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Pack {
  @PrimaryColumn()
  id!: string;

  @Column()
  packName!: string;

  @Column({ default: true })
  active!: boolean;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column('simple-array')
  content!: string[];

  @Column('simple-array')
  childPackIds!: string[];
}
