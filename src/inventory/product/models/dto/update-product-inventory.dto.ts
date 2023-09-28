import { IsEnum, IsNotEmpty, IsNotEmptyObject } from 'class-validator';
import { CutOff } from 'src/enums/product-inventory.enum';
import { Product } from 'src/typeorm';

export class UpdateProductInventoryDto {
    @IsNotEmptyObject({ nullable: false })
    product: Product
    
    updated_by: string;

    balance_begin: number;

    product_in: number;

    product_out: number;

    @IsEnum(CutOff)
    cutoff: CutOff;
}