import { IsEnum, IsNotEmptyObject } from 'class-validator';
import { OrderType, PaymentType } from 'src/enums/order.enum';
import { CutOff } from 'src/enums/product-inventory.enum';
import { Bank, Product } from 'src/typeorm';

export class UpdateOrderDto {
    @IsNotEmptyObject({ nullable: false })
    product: Product

    ordered_to: string;
    
    address: string;

    business_name: string;

    or_number: string;

    description: string;

    payment_type: PaymentType;

    order_type: OrderType;

    cash_amount: number;

    gcash_amount: number;

    grab_amount: number;

    panda_amount: number;
    
    credit_card: boolean;

    credit_card_amount: number;

    credit_card_bank: string;
    
    credit_card_ref_num: string;

    total_discount: number;
    
    @IsEnum(CutOff)
    cutoff: CutOff;
    
    total_amount: number;

    detail_total_amount: number;

    delivery_fee: number;
    
    created_by: string;

    updated_by: string;

    created_at: Date;
}