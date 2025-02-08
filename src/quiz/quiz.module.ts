import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { User, UserSchema } from 'src/auth/entities/user.entity';
import { QuestionModule } from 'src/question/question.module';
import { QuizStudentModule } from 'src/quiz-student/quiz-student.module';
import { Quiz, QuizSchema } from './entities/quiz.entity';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Quiz.name, schema: QuizSchema },
      { name: User.name, schema: UserSchema },
    ]),
    QuizStudentModule,
    QuestionModule,
    ScheduleModule.forRoot()
  ],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
