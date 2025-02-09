import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateQuizStudentDto {

    @IsString()
    @Type(() => String)
    quiz: string;

    @IsString()
    @Type(() => String)
    studentGrade: string;

    @IsString()
    @Type(() => String)
    studentBatch: string;



}
