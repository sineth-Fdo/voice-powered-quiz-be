import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

      // Create a new question student list
      const questionStudentList = new this.questionStudentListModel(CreateQuestionStudentListDto);
      const savedQuestionStudentList = await questionStudentList.save();
      return savedQuestionStudentList.toJSON();

    }catch(err) {
      throw new BadRequestException(`Error: ${err.message}`);
    }
    
  }


}
