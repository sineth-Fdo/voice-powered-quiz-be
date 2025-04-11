import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { QuestionStudentListService } from 'src/question-student-list/question-student-list.service';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Question } from './entities/question.entity';
import { CheckAnswerDto } from './dto/check-answer.dto';
import { User } from 'src/auth/entities/user.entity';
import { QuizStudentService } from 'src/quiz-student/quiz-student.service';

@Injectable()
export class QuestionService {

  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>,
    @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly questionStudentListService: QuestionStudentListService,
    private readonly quizStudentService: QuizStudentService,
  ) {}

  // Create a new question function
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

      // increase the quizTotalQuestions in quiz collection
      await this.quizModel.findOneAndUpdate({ _id: quizId }, { $inc: { quizTotalQuestions: 1 } });
    
      return {
        message : "Question created successfully & Question-Student-List created successfully",
        question: questionExist,
        questionStudentList: questionStudentList,
      } 

    }catch(err) {
      throw new BadRequestException(`Error: ${err.message}`);
    }
    
  }

  // delete all questions with this quizId
  async deleteAllQuestionsAndStudentList(quizId: string) {
    try {
    const allQuestions = await this.questionModel.find({ quiz: new Types.ObjectId(quizId) });

    const questionIds = allQuestions.map(question => question._id.toString());
    await this.questionStudentListService.deleteAllQuestionStudentList(questionIds);
    
    await this.questionModel.deleteMany({ quiz: new Types.ObjectId(quizId) });

    return {
      message: 'All questions and question-student-list deleted successfully',
    };
    

    }catch(err) {
      throw new BadRequestException(`Error: ${err.message}`);
    }
  }

  // Check answer function
  async checkAnswer(checkAnswerDto: CheckAnswerDto) {
    try {
      const quiz = await this.quizModel.findOne({ _id: checkAnswerDto.quizId });
      if(!quiz) {
        throw new BadRequestException('Quiz not found');
      }
      
      const question = await this.questionModel.findOne({ _id: checkAnswerDto.questionId });
      if(!question) {
        throw new BadRequestException('Question not found');
      }

      const student = await this.userModel.findOne({ _id: checkAnswerDto.studentId });
      if(!student) {
        throw new BadRequestException('Student not found');
      }

      const studentAnswer = checkAnswerDto.studentAnswer;
      const correctAnswer = question.correctAnswer;

      if (studentAnswer === correctAnswer) {

        await this.questionStudentListService.pushStudentToCorrectOrIncorrectArray(question._id.toString(), student._id.toString(), true);
        await this.quizStudentService.updateStudentAnswerMarksAndCounts(quiz._id.toString(), student._id.toString(), question._id.toString(), true, checkAnswerDto.studentAnswer);
        
        return {
          message: 'Correct answer',
          
        };
      }else {
        
        await this.questionStudentListService.pushStudentToCorrectOrIncorrectArray(question._id.toString(), student._id.toString(), false);
        await this.quizStudentService.updateStudentAnswerMarksAndCounts(quiz._id.toString(), student._id.toString(), question._id.toString(), false, checkAnswerDto.studentAnswer);

        return {
          message: 'Incorrect answer',
        };
      }


    }catch(err) {
      throw new BadRequestException(`Error: ${err.message}`);
    }
  }

  // Find all questions with this quizId
  async find(quizId: string, userId: string, questionNumber?: number) {
    try {

      const quiz = await this.quizModel.findOne({ _id: new Types.ObjectId(quizId) });
      if(!quiz) {
        throw new BadRequestException('Quiz not found');
      }

      const user = await this.userModel.findOne({ _id: new Types.ObjectId(userId) });
      if(!user) {
        throw new BadRequestException('User not found');
      }

      let questions;

      if (user.role == 'student') {
        if (questionNumber != undefined) {
          questions = await this.questionModel.find({ 
            quiz: new Types.ObjectId(quizId),
            questionNumber: questionNumber ? questionNumber : { $exists: true },
          })
          .populate({
            path : 'quiz',
            model : 'Quiz',
          }).exec();
        }else {
          throw new BadRequestException('Question number is required');
        }

      }

      // is User is not a student 
      questions = await this.questionModel.find({ 
        quiz: new Types.ObjectId(quizId),
        questionNumber: questionNumber ? questionNumber : { $exists: true },
      })
      .populate({
        path : 'quiz',
        model : 'Quiz',
      }).exec();
      if(questions.length === 0) {
        throw new BadRequestException('No questions found');
      }

      return questions;

    }catch(err) {
      throw new BadRequestException(`Error: ${err.message}`);
    }
  }


  // Delete a question with questionId
  async deleteQuestion(questionId: string) {
    try {
      const question = await this.questionModel.findOne({ _id: new Types.ObjectId(questionId) });
      if(!question) {
        throw new BadRequestException('Question not found');
      }

      await this.questionModel.findOneAndDelete({ _id: new Types.ObjectId(questionId) });

      return {
        message: 'Question deleted successfully',
      }

    }catch(err) {
      throw new BadRequestException(`Error: ${err.message}`);
    }
  }



}
