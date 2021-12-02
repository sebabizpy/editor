import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import BaseEntity from "../../../BaseEntity";

export enum ROLE {
  USER,
  ENGINEER,
  APPROVER,
  ADMIN,
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "userId" })
  public id: number;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column()
  public email: string;

  @Column({ nullable: true })
  public password: string;

  @Column({ default: "Web" })
  public createdIn: string;

  @Column({ nullable: true })
  public phone: string;

  @Column({ nullable: true })
  public celPhone?: string;

  @Column({ nullable: true })
  public address: string;

  @Column({ nullable: true })
  public cp: string;

  @Column({ nullable: true })
  public cuitCuil: string;

  @Column({ nullable: true })
  public province: string;

  @Column({ nullable: true })
  public city: string;

  @Column({
    type: "enum",
    enum: Object.values(ROLE),
    default: ROLE.USER,
  })
  public role: number;
}
