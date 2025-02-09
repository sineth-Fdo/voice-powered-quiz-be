import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionStudentListModule } from 'src/question-student-list/question-student-list.module';
import { Question, QuestionSchema } from './entities/question.entity';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { Quiz, QuizSchema } from 'src/quiz/entities/quiz.entity';
import { User, UserSchema } from 'src/auth/entities/user.entity';
import { QuizStudentModule } from 'src/quiz-student/quiz-student.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
      { name: Quiz.name, schema: QuizSchema },
      { name: User.name, schema: UserSchema}
    ]),
    QuestionStudentListModule,
    QuizStudentModule,
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
