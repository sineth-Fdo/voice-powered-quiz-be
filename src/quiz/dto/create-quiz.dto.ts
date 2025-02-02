import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateQuizDto {
    @IsString()
    title: string;

    @IsString()
    code: string;

    @IsString()
    description: string;

    @IsString()
    password: string;

    @IsString()
    @IsEnum(['not-started', 'started', 'completed'])
    status: string;

    @IsString()
    teacher: string;

    @IsString()
    subject: string;

    @IsString()
    grade: string;

    @IsNumber()
    duration: number;

    @IsNumber()
    totalMarks: number;

    @IsNumber()
    passingMarks: number;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    startDate: Date;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    endDate: Date;
    
}
