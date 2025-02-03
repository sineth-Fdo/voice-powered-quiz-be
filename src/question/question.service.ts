import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Question } from './entities/question.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { QuestionStudentListService } from 'src/question-student-list/question-student-list.service';

@Injectable()
export class QuestionService {

  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>,
    @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
    private readonly questionStudentListService: QuestionStudentListService,
  ) {}

  // Create a new question
  async create(createQuestionDto: CreateQuestionDto) {
    try {

      const quiz = await this.quizModel.findOne({ _id : createQuestionDto.quiz });
      if(!quiz) {
        throw new BadRequestException('Quiz not found');
      }

      const quizId = new Types.ObjectId(createQuestionDto.quiz);
      if (!quizId) {
        throw new BadRequestException('Quiz not found');
      }

      // Create a new question
      const question = this.questionModel.create({
        quiz: quizId,
        questionNumber: createQuestionDto.questionNumber,
        question: createQuestionDto.question,
        correctAnswer: createQuestionDto.correctAnswer,
        options: createQuestionDto.options,
        marks: createQuestionDto.marks,
      });


      const questionExist = await this.questionModel.findOne({ _id: (await question)._id });
      if(!questionExist) {
        throw new BadRequestException('Question already exists');
      }

      const questionId = questionExist._id.toString(); 

      // Create a new question-student-list
      const questionStudentList = await this.questionStudentListService.create({
        question: questionId,
        correct: [],
        incorrect: [],
      });
    

      return {
        message : "Question created successfully & Question-Student-List created successfully",
        question: questionExist,
        questionStudentList: questionStudentList,

      } 

    }catch(err) {
      throw new BadRequestException(`Error: ${err.message}`);
    }
    
  }

}
