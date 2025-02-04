import { IsString } from "class-validator";

export class CreateBatchDto {
    
    @IsString()
    name: string;
}
