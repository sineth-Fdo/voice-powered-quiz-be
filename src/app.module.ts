import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import config from './config/config';
import { UserModule } from './user/user.module';
import { SubjectModule } from './subject/subject.module';
import { QuizModule } from './quiz/quiz.module';
import { QuestionModule } from './question/question.module';
import { QuestionStudentListModule } from './question-student-list/question-student-list.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
