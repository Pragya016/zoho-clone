import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./server/src/entity/Admin";

@Entity({
  name: 'employees'
})
export class Employee {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  role!: string;

  @ManyToOne(() => User, (user) => user.id)
  user_id!: User
}
