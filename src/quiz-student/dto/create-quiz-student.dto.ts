import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateQuizStudentDto {

    @IsString()
    @Type(() => String)
    quiz: string;

    @IsString()
    @Type(() => String)
    student: string;

    // @IsNumber()
    // @Type(() => Number)
    // correctMarks: number;

    // @IsNumber()
    // @Type(() => Number)
    // incorrectMarks: number;

    // @IsNumber()
    // @Type(() => Number)
    // correctAnswers: number;

    // @IsNumber()
    // @Type(() => Number)
    // incorrectAnswers: number;

    // @IsBoolean()
    // @Type(() => Boolean)
    // attempted: boolean;

    // @IsNumber()
    // @Type(() => Number)
    // totalQuestions: number;

    // @IsNumber()
    // @Type(() => Number)
    // totalMarks: number;
    
    // @IsArray()
    // @Type(() => Object)
    // answeredQuestions: {
    //         questionNumber: number;
    //         answer: string;
    //         participantAnswer: boolean;
    // }[];


}
