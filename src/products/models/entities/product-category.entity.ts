import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Status } from "src/enums/status.enum";

@Entity()
export class ProductCategory extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column()
    name: string;

    // @OneToOne(() => ProductCategory)
    // @JoinColumn()
    // parent?: ProductCategory;

    @Column({ type: "enum", enum: Status, default: Status.ENABLED })
    status: Status;

    @Column()
    @CreateDateColumn()
    created_at: Date;

    @Column()
    @UpdateDateColumn()
    updated_at: Date;

    @Column()
    created_by: string;

    @Column()
    updated_by: string;
}