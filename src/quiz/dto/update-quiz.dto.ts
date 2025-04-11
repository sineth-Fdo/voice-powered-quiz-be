import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateQuizDto {
    @IsString()
    title: string;

    @IsString()
    code: string;

    @IsString()
    description: string;

    @IsString()
    password: string;

    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    startDate: String;

    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    startTime: String;

    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    endTime: String;
    
}
