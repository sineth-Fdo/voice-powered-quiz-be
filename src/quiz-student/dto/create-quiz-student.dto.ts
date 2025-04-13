import { Type } from "class-transformer";
import { IsString } from "class-validator";

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

    @IsString()
    @Type(() => String)
    teacher: string;



}
