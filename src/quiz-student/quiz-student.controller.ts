import { Body, Controller, Post } from '@nestjs/common';
import { QuizStudentService } from './quiz-student.service';
import { CreateQuizStudentDto } from './dto/create-quiz-student.dto';

@Controller('quiz-student')
export class QuizStudentController {
  constructor(private readonly quizStudentService: QuizStudentService) {}

  @Post('create')
  create(@Body() createQuizStudentDto: CreateQuizStudentDto) {
    return this.quizStudentService.create(createQuizStudentDto);
  }


}
