import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Quiz } from './entities/quiz.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class QuizService {
  
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
  ) {}

  // Create a new quiz
  async create(createQuizDto: CreateQuizDto) {
    try {

      // Check if the quiz already exists
      const quizExist = await this.quizModel.findOne({ name: createQuizDto.title });
      if(quizExist) {
        throw new BadRequestException('Quiz already exists');
      }

      // Create a new quiz
      const quiz = new this.quizModel(createQuizDto);
      const savedQuiz = await quiz.save();
      return savedQuiz.toJSON();

    }catch(err) {
      throw new BadRequestException(`Error: ${err.message}`);
    }
    
  }

}
