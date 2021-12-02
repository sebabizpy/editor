import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export default class BaseEntity {

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;

  @Column({ default: true })
  public active!: boolean;
}
