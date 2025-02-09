import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto } from './create-question.dto';
import { IsString } from 'class-validator';

export class CheckAnswerDto extends PartialType(CreateQuestionDto) {
    
    @IsString()
    quizId: string;

    @IsString()
    questionId: string;

    @IsString()
    studentId: string;

    @IsString()
    studentAnswer: string;


}
