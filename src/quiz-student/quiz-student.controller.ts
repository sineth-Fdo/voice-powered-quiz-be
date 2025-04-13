import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CreateQuizStudentDto } from './dto/create-quiz-student.dto';
import { QuizStudentService } from './quiz-student.service';

@Controller('quiz-student')
export class QuizStudentController {
  constructor(private readonly quizStudentService: QuizStudentService) {}

  @Post('create')
  create(@Body() createQuizStudentDto: CreateQuizStudentDto) {
    return this.quizStudentService.create(createQuizStudentDto);
  }

  @Delete('delete/:quizId')
  delete(
    @Param('quizId') quizId: string,
  ) {
    return this.quizStudentService.deleteAllQuizStudents(quizId);
  }

    @Get('all')
    findAll(
      @Query('quizId') quizId: string,
      @Query('student') student: string,
      @Query('teacherId') teacherId: string,
    ) {
      return this.quizStudentService.findAll(quizId, student, teacherId);
    }

    @Get('findOne/:quizId/:studentId')
    findOneStudent(
      @Param('quizId') quizId: string,
      @Param('studentId') studentId: string,
    ) {
      return this.quizStudentService.findOne(quizId, studentId);
    }

}
