import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { QuestionStudentList } from './entities/question-student-list.entity';
import { Question } from 'src/question/entities/question.entity';
import { CreateQuestionStudentListDto } from './dto/create-question-student-list.dto';

@Injectable()
export class QuestionStudentListService {

  constructor(
    @InjectModel(QuestionStudentList.name) private questionStudentListModel: Model<QuestionStudentList>,
    @InjectModel(Question.name) private questionModel: Model<Question>,
  ) {}

  // Create a new question-student-list
  async create(CreateQuestionStudentListDto : CreateQuestionStudentListDto) {
    try {

      const questionExist = await this.questionModel.findOne({ _id: CreateQuestionStudentListDto.question });
      if(!questionExist) {
        throw new BadRequestException('Question student list already exists');
      }

      const questionId = new Types.ObjectId(CreateQuestionStudentListDto.question);

      // Create a new question student list
      const questionStudentList =  this.questionStudentListModel.create({
        question: questionId,
        correct: CreateQuestionStudentListDto.correct,
        incorrect: CreateQuestionStudentListDto.incorrect,
      });
      return questionStudentList;

    }catch(err) {
      throw new BadRequestException(`Error: ${err.message}`);
    }
    
  }


}
