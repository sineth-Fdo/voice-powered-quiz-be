import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionStudentListModule } from 'src/question-student-list/question-student-list.module';
import { Question, QuestionSchema } from './entities/question.entity';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { Quiz, QuizSchema } from 'src/quiz/entities/quiz.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }]),
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]),
    QuestionStudentListModule,
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
