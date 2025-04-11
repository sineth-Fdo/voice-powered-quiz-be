import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BatchModule } from './batch/batch.module';
import config from './config/config';
import { QuestionStudentListModule } from './question-student-list/question-student-list.module';
import { QuestionModule } from './question/question.module';
import { QuizStudentModule } from './quiz-student/quiz-student.module';
import { QuizModule } from './quiz/quiz.module';
import { SubjectModule } from './subject/subject.module';
import { UserModule } from './user/user.module';


@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
      envFilePath: ['.env'],
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('database.connectionString')
      }),
      inject: [ConfigService],
    }),

    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    SubjectModule,
    AuthModule,
    UserModule,
    QuizModule,
    QuestionModule,
    QuestionStudentListModule,
    QuizStudentModule,
    BatchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
