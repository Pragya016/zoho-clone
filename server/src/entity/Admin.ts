import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({
  name: 'admins'
})
export class Admin {
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
}
