import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column()
  uid!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'varchar', nullable: true })
  phone!: string | null;

  @Column({ type: 'varchar', nullable: true })
  address!: string | null;

  @Column({ type: 'varchar', nullable: true })
  date_of_birth!: string | null;

  @Column({ type: 'varchar', nullable: true })
  date_of_joining!: string | null;

  @Column({ type: 'varchar', nullable: true })
  date_of_leaving!: string | null;

  @Column()
  role!: string;

  @Column({ type: "varchar", nullable: true })
  department!: string | null;

  @Column({ type: "varchar", nullable: true })
  designation!: string | null;
}