import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Quiz } from './entities/quiz.entity';
import { Model, Types } from 'mongoose';
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

      const teacher = new Types.ObjectId(createQuizDto.teacher);
      if (!teacher) {
        throw new BadRequestException('Teacher not found');
      }

      const subject = new Types.ObjectId(createQuizDto.subject);
      if (!subject) {
        throw new BadRequestException('Subject not found');
      }

      // Create a new quiz
      const quiz = await this.quizModel.create({
        teacher,
        subject,
        title: createQuizDto.title,
        code: createQuizDto.code,
        description: createQuizDto.description,
        password: createQuizDto.password,
        status: createQuizDto.status,
        grade: createQuizDto.grade,
        duration: createQuizDto.duration,
        totalMarks: createQuizDto.totalMarks,
        passingMarks: createQuizDto.passingMarks,
        startDate: createQuizDto.startDate,
        endDate: createQuizDto.endDate
        
      });

      return quiz;

    }catch(err) {
      throw new BadRequestException(`Error: ${err.message}`);
    }
    
  }

}
