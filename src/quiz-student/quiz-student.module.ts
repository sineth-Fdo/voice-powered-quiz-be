import { Module } from '@nestjs/common';
import { QuizStudentService } from './quiz-student.service';
import { QuizStudentController } from './quiz-student.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizStudent, QuizStudentSchema } from './entities/quiz-student.entity';
import { Quiz, QuizSchema } from 'src/quiz/entities/quiz.entity';
import { User, UserSchema } from 'src/auth/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuizStudent.name, schema: QuizStudentSchema },
      { name: Quiz.name, schema: QuizSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [QuizStudentController],
  providers: [QuizStudentService],
  exports: [QuizStudentService],
})
export class QuizStudentModule {}
