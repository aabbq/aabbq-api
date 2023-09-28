import { CutOff } from "src/enums/product-inventory.enum";
import { Product } from "src/typeorm";
import { ColumnNumericTransformer } from "src/utils/helper";
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";

@Entity()
export class ProductIn extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @ManyToOne(() => Product, (product) => product)
    product: Product

    @Column({ default: '' })
    location: string;

    @Column({ type: "datetime", default: () => "NOW()" })
    transaction_date: Date;

    @Column("decimal", {
        precision: 11, scale: 2, default: 0,
        transformer: new ColumnNumericTransformer(),
    })
    qty: number;

    @Column("longtext")
    description: string;

    @Column({ type: "enum", enum: CutOff, default: CutOff.AM })
    cutoff: CutOff;
    
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