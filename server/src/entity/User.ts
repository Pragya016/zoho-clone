import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({
  name: 'users'
})
export class User {
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

  @Column({ type: 'integer', nullable: true })
  adminId!: number | null;
}
