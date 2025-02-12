import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Question } from 'src/question/entities/question.entity';
import { CreateQuestionStudentListDto } from './dto/create-question-student-list.dto';
import { QuestionStudentList } from './entities/question-student-list.entity';

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

  // Find all question-student-list and delete
  async deleteAllQuestionStudentList(questionIds: string[]) {
    try {
      for(let i = 0; i < questionIds.length; i++) {
        await this.questionStudentListModel.deleteMany({ question: new Types.ObjectId(questionIds[i]) });
      }
      return {
        message: 'All question-student-list deleted successfully',
      };
    }catch(err) {
      throw new BadRequestException(`Error: ${err.message}`);
    }
  }

  // push students to correct or incorrect array
  async pushStudentToCorrectOrIncorrectArray(questionId: string, studentId: string, correct: boolean) {
    try {

      const questionStudentList = await this.questionStudentListModel.findOne({ question: new Types.ObjectId(questionId) });
      if(!questionStudentList) {
        throw new BadRequestException('Question student list not found');
      }

      // is student already in correct or incorrect array
      const studentExistInCorrect = questionStudentList.correct.find(student => student.studentId.toString() === studentId);
      const studentExistInIncorrect = questionStudentList.incorrect.find(student => student.studentId.toString() === studentId);

      if(studentExistInCorrect || studentExistInIncorrect) {
        throw new BadRequestException('Student already in correct or incorrect array');
      }
      

      if(correct) {
        questionStudentList.correct.push({ studentId: new Types.ObjectId(studentId) });
      }else {
        questionStudentList.incorrect.push({ studentId: new Types.ObjectId(studentId)});
      }

      await questionStudentList.save();

      return {
        message: 'Student pushed to correct or incorrect array successfully',
      };

    }catch(err) {
      throw new BadRequestException(`Error: ${err.message}`);
    }
  }




}
