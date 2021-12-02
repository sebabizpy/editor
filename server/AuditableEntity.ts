import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./app/users/model/users.model";
import BaseEntity from "./BaseEntity";

@Entity()
export default class AuditableEntity extends BaseEntity {
  @ManyToOne((type) => User)
  @JoinColumn()
  public createdBy: User;

  @ManyToOne((type) => User)
  @JoinColumn()
  public updatedBy: User;
}
