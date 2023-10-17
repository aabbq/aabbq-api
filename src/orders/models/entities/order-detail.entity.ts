import { Product } from "src/typeorm";
import { ColumnNumericTransformer } from "src/utils/helper";
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, BeforeInsert, AfterUpdate } from "typeorm";
import { Order } from "./order.entity";
import { PaymentType } from "src/enums/order.enum";

@Entity()
export class OrderDetail extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @ManyToOne(() => Product, (product) => product)
    product: Product

    @Column("decimal", {
        precision: 11, scale: 2, default: 0,
        transformer: new ColumnNumericTransformer(),
    })
    qty: number;

    @Column("decimal", {
        precision: 11, scale: 2, default: 0,
        transformer: new ColumnNumericTransformer(),
    })
    price: number;

    @Column("decimal", {
        precision: 11, scale: 2, default: 0,
        transformer: new ColumnNumericTransformer(),
    })
    total: number;

    @ManyToOne(() => Order, (order) => order.details)
    order: Order;
    
    @BeforeInsert()
    @AfterUpdate()
    updateTotal() {
        this.total = this.qty * this.price;
    }

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