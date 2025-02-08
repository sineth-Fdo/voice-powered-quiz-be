import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizDto } from './create-quiz.dto';
import { IsNumber } from 'class-validator';

export class UpdateTotalsDto extends PartialType(CreateQuizDto) {

    @IsNumber()
    quizTotalMarks?: number;

    @IsNumber()
    quizTotalQuestions?: number;

    @IsNumber()
    passingMarks?: number;
}
