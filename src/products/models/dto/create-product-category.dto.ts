import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from 'src/enums/status.enum';
import { ProductCategory } from '../entities/product-category.entity';

export class CreateProductCategoryDto {
    @IsNotEmpty()
    name: string;

    // parent: ProductCategory;

    @IsEnum(Status)
    status: Status;

    created_by: string;

    updated_by: string;
}