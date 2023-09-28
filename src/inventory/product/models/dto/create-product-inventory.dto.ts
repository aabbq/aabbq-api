import { IsEmpty, IsEnum, IsNotEmptyObject } from 'class-validator';
import { CutOff } from 'src/enums/product-inventory.enum';
import { Product } from 'src/typeorm';

export class CreateProductInventoryDto {
    @IsNotEmptyObject({ nullable: false })
    product: Product

    balance_begin: number;
    
    balance_end: number;

    product_in: number;

    total: number;

    @IsEnum(CutOff)
    cutoff: CutOff;
    
    product_out: number;

    created_by: string;

    updated_by: string;

    created_at: Date;
}