import { CutOff } from "src/enums/product-inventory.enum";
import { Product } from "src/typeorm";
import { ColumnNumericTransformer } from "src/utils/helper";
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, BeforeInsert, BeforeUpdate } from "typeorm";

@Entity()
export class ProductInventory extends BaseEntity {
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
    balance_begin: number; // Beginning balance

    @Column("decimal", {
        precision: 11, scale: 2, default: 0,
        transformer: new ColumnNumericTransformer(),
    })
    product_in: number; // Stock in

    @Column("decimal", {
        precision: 11, scale: 2, default: 0,
        transformer: new ColumnNumericTransformer(),
    })
    total: number; // Total : Begin Balance + Stock In

    @Column("decimal", {
        precision: 11, scale: 2, default: 0,
        transformer: new ColumnNumericTransformer(),
    })
    balance_end: number; // Balance end : Total - Sold

    @Column("decimal", {
        precision: 11, scale: 2, default: 0,
        transformer: new ColumnNumericTransformer(),
    })
    product_out: number; // Sold

    @Column("decimal", {
        precision: 11, scale: 2, default: 0,
        transformer: new ColumnNumericTransformer(),
    })
    total_prices: number; // Total Prices

    @Column({ type: "enum", enum: CutOff, default: CutOff.AM })
    cutoff: CutOff;

    @Column("decimal", {
        precision: 11, scale: 2, default: 0,
        transformer: new ColumnNumericTransformer(),
    })
    default_prices: number; // Default Prices

    @Column("decimal", {
        precision: 11, scale: 2, default: 0,
        transformer: new ColumnNumericTransformer(),
    })
    default_qty: number; // Total default Quantity

    @Column("decimal", {
        precision: 11, scale: 2, default: 0,
        transformer: new ColumnNumericTransformer(),
    })
    grab_prices: number; // Grab Prices

    @Column("decimal", {
        precision: 11, scale: 2, default: 0,
        transformer: new ColumnNumericTransformer(),
    })
    grab_qty: number; // Total grab Quantity

    @Column("decimal", {
        precision: 11, scale: 2, default: 0,
        transformer: new ColumnNumericTransformer(),
    })
    panda_prices: number; // Panda Prices

    @Column("decimal", {
        precision: 11, scale: 2, default: 0,
        transformer: new ColumnNumericTransformer(),
    })
    panda_qty: number; // Total panda Quantity

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

    @BeforeInsert()
    @BeforeUpdate()
    updateTotal() {
        this.total = this.balance_begin + this.product_in;
        this.balance_end = this.total - this.product_out;
    }

}