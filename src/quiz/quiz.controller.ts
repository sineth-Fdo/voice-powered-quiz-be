import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { QuizService } from './quiz.service';
import { UpdateTotalsDto } from './dto/update-totals.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('create') 
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.create(createQuizDto);
  }

  @Delete('delete/:quizId')
  delete(
    @Param('quizId') quizId: string,
  ) {
    return this.quizService.delete(quizId);
  }

  @Patch('update-totals/:quizId')
  update(
    @Param('quizId') quizId: string,
    @Body() UpdateTotalsDto: UpdateTotalsDto,
  ) {
    return this.quizService.updateTotals(quizId, UpdateTotalsDto);
  }

  @Patch('update-status/:quizId')
  updateStatus(
    @Param('quizId') quizId: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.quizService.updateStatus(quizId, updateStatusDto);
  }

}
