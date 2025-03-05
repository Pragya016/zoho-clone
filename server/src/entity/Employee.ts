import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

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
  position!: string;

  @Column()
  role!: string;

  @ManyToOne(() => User, (user: User) => user.id)
  user!: User
}
