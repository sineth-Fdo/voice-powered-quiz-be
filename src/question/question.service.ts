import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {

  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>,
  ) {}

  // Create a new question
  async create(createQuestionDto: CreateQuestionDto) {
    try {

      // Create a new question
      const question = new this.questionModel(createQuestionDto);
      const savedQuestion = await question.save();
      return savedQuestion.toJSON();

    }catch(err) {
      throw new BadRequestException(`Error: ${err.message}`);
    }
    
  }

}
