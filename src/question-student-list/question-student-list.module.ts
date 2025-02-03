import { Module } from '@nestjs/common';
import { QuestionStudentListService } from './question-student-list.service';
import { QuestionStudentListController } from './question-student-list.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionStudentList, QuestionStudentListSchema } from './entities/question-student-list.entity';
import { Question, QuestionSchema } from 'src/question/entities/question.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuestionStudentList.name, schema: QuestionStudentListSchema },
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  controllers: [QuestionStudentListController],
  providers: [QuestionStudentListService],
  exports: [QuestionStudentListService],
})
export class QuestionStudentListModule {}
