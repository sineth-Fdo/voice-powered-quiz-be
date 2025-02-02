import { IsNumber, IsString } from "class-validator";

export class CreateQuestionDto {

    @IsString()
    quiz: string;

    @IsNumber()
    questionNumber: number;

    @IsString()
    question: string;

    @IsString()
    correctAnswer: string;

    @IsString(
        { each: true }
    )
    options: {
        option: string;
    }[];

    @IsNumber()
    marks: number;

}
