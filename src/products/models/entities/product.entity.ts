import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm";
import { Status } from "src/enums/status.enum";
import { UOM } from "src/enums/uom.enum";
import { ColumnNumericTransformer } from "src/utils/helper";

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ type: "enum", enum: UOM, default: UOM.PC })
    uom: UOM;

    @Column({ type: "enum", enum: Status, default: Status.ENABLED })
    status: Status;

    @Column("decimal", {
        precision: 11, scale: 2, default: 0,
        transformer: new ColumnNumericTransformer(),
    })
    qty: number; // Sold

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