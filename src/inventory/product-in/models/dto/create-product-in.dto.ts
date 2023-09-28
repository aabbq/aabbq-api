import { IsEmpty, IsEnum, IsNotEmptyObject } from 'class-validator';
import { CutOff } from 'src/enums/product-inventory.enum';
import { Product } from 'src/typeorm';

export class CreateProductInDto {
    @IsNotEmptyObject({ nullable: false })
    product: Product

    qty: number;

    @IsEnum(CutOff)
    cutoff: CutOff;
    
    created_by: string;

    updated_by: string;

    created_at: Date;

    description: string;
}