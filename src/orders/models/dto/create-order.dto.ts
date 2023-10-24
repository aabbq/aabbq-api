import { IsEnum } from "class-validator";
import { OrderType, PaymentType } from "src/enums/order.enum";
import { CutOff } from "src/enums/product-inventory.enum";

export class CreateOrderDto {
    ordered_to: string;
    
    address: string;

    business_name: string;

    or_number: string;

    payment_type: PaymentType;

    gcash_amount: number;

    grab_amount: number;

    panda_amount: number;

    order_type: OrderType;

    total_cash: number;
    
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

    transaction_date: Date;
}