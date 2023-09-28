import { OrderType, PaymentType } from "src/enums/order.enum";
import { CutOff } from "src/enums/product-inventory.enum";
import { ColumnNumericTransformer } from "src/utils/helper";
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, AfterLoad, BeforeUpdate, ManyToOne, BeforeInsert } from "typeorm";
import { OrderDetail } from "./order-detail.entity";

@Entity()
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ default : '' })
    ordered_to: string;

    @Column({ default : '' })
    address: string;
    
    @Column({ default : '' })
    business_name: string;

    @Column({ default : '', unique: true })
    or_number: string;

    @Column({ type: "datetime", default: () => "NOW()" })
    transaction_date: Date;

    @Column("decimal", {
        precision: 11, scale: 2, default: 0,
        transformer: new ColumnNumericTransformer(),
    })
    total_amount: number;
    
    @OneToMany(() => OrderDetail, (detail) => detail.order, {
        eager: true,
    })
    details: OrderDetail[];

    // @AfterLoad()
    @BeforeUpdate()
    @BeforeInsert()
    updateTotalAmount() {
        let totalDetailAmount = 0;
        if (this.details != null && this.details.length > 0) {
            for (let index = 0; index < this.details.length; index++) {
              const detail = this.details[index];
              totalDetailAmount += detail.total;
            }
      
            this.total_amount = (Math.round(totalDetailAmount * 100) / 100) - this.total_discount;
            if (this.credit_card_amount > 0){
                this.cash_amount -= this.credit_card_amount;
            } else {
                if (this.payment_type == PaymentType.CASH) {
                    this.cash_amount = this.total_amount + this.total_discount;
                }
            }
        }
    }

    @Column("longtext")
    description: string;

    @Column({ type: "enum", enum: OrderType, default: OrderType.DINEIN })
    order_type: OrderType;

    @Column({ type: "enum", enum: PaymentType, default: PaymentType.CASH })
    payment_type: PaymentType;

    @Column("decimal", {
        precision: 11, scale: 2, default: 0,
        transformer: new ColumnNumericTransformer(),
    })
    cash_amount: number;

    @Column("decimal", {
        precision: 11, scale: 2, default: 0,
        transformer: new ColumnNumericTransformer(),
    })
    gcash_amount: number;

    @Column("decimal", {
        precision: 11, scale: 2, default: 0,
        transformer: new ColumnNumericTransformer(),
    })
    grab_amount: number;

    @Column("decimal", {
        precision: 11, scale: 2, default: 0,
        transformer: new ColumnNumericTransformer(),
    })
    panda_amount: number;

    @Column()
    credit_card: boolean;

    @Column("decimal", {
        precision: 11, scale: 2, default: 0,
        transformer: new ColumnNumericTransformer(),
    })
    credit_card_amount: number;

    @Column({ default : '' })
    credit_card_bank: string

    @Column({ default : '' })
    credit_card_ref_num: string;

    @Column("decimal", {
        precision: 11, scale: 2, default: 0,
        transformer: new ColumnNumericTransformer(),
    })
    total_discount: number;

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