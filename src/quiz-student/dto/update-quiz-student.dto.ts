import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizStudentDto } from './create-quiz-student.dto';

export class UpdateQuizStudentDto extends PartialType(CreateQuizStudentDto) {}
