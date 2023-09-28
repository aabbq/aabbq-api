import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from 'src/enums/status.enum';
import { UOM } from 'src/enums/uom.enum';

export class UpdateProductDto {
    @IsNotEmpty()
    name: string;

    @IsEnum(Status)
    status: Status;

    description: string;

    @IsEnum(UOM)
    uom: UOM;

    updated_by: string;
    
    qty: number;

    category: string;
}