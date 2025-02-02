import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionStudentListDto } from './create-question-student-list.dto';

export class UpdateQuestionStudentListDto extends PartialType(CreateQuestionStudentListDto) {}
