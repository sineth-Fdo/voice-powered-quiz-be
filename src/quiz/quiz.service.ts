import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { Quiz } from './entities/quiz.entity';
import { QuizStudentService } from 'src/quiz-student/quiz-student.service';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class QuizService {
  
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly quizStudentService: QuizStudentService
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

      // Check if the student exists with this grade and batch
      const studentExist = await this.userModel.find({ grade: createQuizDto.grade, batch: createQuizDto.batch });
      if(studentExist.length === 0) {
        throw new BadRequestException('No student found with this grade and batch');
      }

      // check if the startTime is not yesterday or before
      const currentDate = new Date().toISOString().split('T')[0];
      const startDate = createQuizDto.startDate;
      
      if(startDate < currentDate) {
        throw new BadRequestException('Start date cannot be yesterday or before');
      }

      // give the startTime and endTime duration in minutes
      const startTime = new Date(createQuizDto.startDate + ' ' + createQuizDto.startTime);
      const endTime = new Date(createQuizDto.startDate + ' ' + createQuizDto.endTime);
      const duration = (endTime.getTime() - startTime.getTime()) / 60000;

      const durationHours = Math.floor(duration / 60);
      const durationMinutes = duration % 60;

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
        batch: createQuizDto.batch,
        duration: duration,
        durationHours: durationHours,
        durationMinutes: durationMinutes,
        totalMarks: createQuizDto.totalMarks,
        passingMarks: createQuizDto.passingMarks,
        startDate: createQuizDto.startDate,
        startTime: createQuizDto.startTime,
        endTime: createQuizDto.endTime,
        
      });

      const quizId: string = quiz._id.toString();
      
      
      // Create a new quiz-student
      await this.quizStudentService.create(
        {
          quiz: quizId.toString(),
          studentGrade: createQuizDto.grade,
          studentBatch: "2024"
        }
      );

      return {
        message: `Quiz created successfully & ${createQuizDto.grade} students are assigned to this quiz`,
        data: quiz
      };

    }catch(err) {
      throw new BadRequestException(`Error: ${err.message}`);
    }
    
  }

}
