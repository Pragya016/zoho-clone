import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tasks'})
export class Task {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column()
    description!: string;
    
    @Column()
    created_by!: string;

    @Column({nullable: true, type:'varchar'})
    assigned_by!: string | null;

    @Column({nullable: true, type:'varchar'})
    assigned_to!: string | null;

    @Column({nullable: true, type: 'varchar'})
    status!: string | null;
}