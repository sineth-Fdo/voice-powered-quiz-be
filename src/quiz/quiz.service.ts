import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment-timezone';
import { Model, Types } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';
import { QuestionService } from 'src/question/question.service';
import { QuizStudentService } from 'src/quiz-student/quiz-student.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateTotalsDto } from './dto/update-totals.dto';
import { Quiz } from './entities/quiz.entity';


@Injectable()
export class QuizService {
  
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly quizStudentService: QuizStudentService,
    private readonly questionService: QuestionService,
  ) {}

  onModuleInit() {
    this.startQuizCheckingInterval();
  }

  // quiz status changing interval
  async startQuizCheckingInterval() {

    setInterval(async () => {
      //  get the local time
      const localISOTime = moment().tz('Asia/Colombo').format("YYYY-MM-DDTHH:mm:ss.SSSZ");
      
      const currentDate = localISOTime.split('T')[0];
      const currentTime = localISOTime.split('T')[1].split('.')[0].split(':').slice(0, 2).join(':');
      const currentDateTime = currentDate + ' ' + currentTime;

      // starting the quizes
      const allQuizzes = await this.quizModel.find({ status: 'not-started' });
      
      allQuizzes.forEach(async (quiz) => {
        const quizStartTime = quiz.startDate + ' ' + quiz.startTime;
        if(quizStartTime === currentDateTime) {
          await this.quizModel.findByIdAndUpdate(quiz._id, { status: 'started' });
        }
      });

      // completing the quizes
      const allQuizzesStarted = await this.quizModel.find({ status: 'started' });

      allQuizzesStarted.forEach(async (quiz) => {
        const quizEndTime = quiz.startDate + ' ' + quiz.endTime;
        if(quizEndTime === currentDateTime) {
          await this.quizModel.findByIdAndUpdate(quiz._id, { status: 'completed' });
        }
      });

  }, 1000); // 1 seconds
  }

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
        quizTotalMarks: createQuizDto.quizTotalMarks,
        quizTotalQuestions: createQuizDto.quizTotalQuestions,
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
          studentBatch: createQuizDto.batch,
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

  // Delete a quiz
  async delete(quizId: string) {
    try {

      // Check if the quiz exists
      const quizExist = await this.quizModel.findById(quizId);
      if(!quizExist) {
        throw new BadRequestException('Quiz not found');
      }

      // Delete all quiz-student with this quizId
      await this.quizStudentService.deleteAllQuizStudents(quizId);

      // Delete all questions and student-list with this quizId 
      await this.questionService.deleteAllQuestionsAndStudentList(quizId); 

      // Delete the quiz
      await this.quizModel.findByIdAndDelete(quizId);

      return {
        message: 'Quiz deleted successfully',
      };

    }catch(err) {
      throw new BadRequestException(`Error: ${err.message}`);
    }
  }



  // Update the totals of a quiz
  async updateTotals(quizId: string, updateTotalsDto: UpdateTotalsDto) {
    try {

      // Check if the quiz exists
      const quizExist = await this.quizModel.findById(quizId);
      if(!quizExist) {
        throw new BadRequestException('Quiz not found');
      }

      const quizTotalMarks = updateTotalsDto.quizTotalMarks;
      const quizPassingMarks = updateTotalsDto.passingMarks;

      if (quizTotalMarks <= quizPassingMarks) {
        throw new BadRequestException('Total marks cannot be greater than passing marks');
      }

      // Update the quiz
      await this.quizModel.findByIdAndUpdate(quizId, updateTotalsDto);

      return {
        message: 'Quiz totals updated successfully',
      };

    }catch(err) {
      throw new BadRequestException(`Error: ${err.message}`);
    }
  }

  // Update the status of a quiz
  async updateStatus(quizId: string, updateStatusDto: UpdateStatusDto) {
    try {

      // Check if the quiz exists
      const quizExist = await this.quizModel.findById(quizId);
      if(!quizExist) {
        throw new BadRequestException('Quiz not found');
      }

      // Update the quiz
      await this.quizModel.findByIdAndUpdate(quizId, { status: updateStatusDto.status });

      return {
        message: 'Quiz status updated successfully',
      };

    }catch(err) {
      throw new BadRequestException(`Error: ${err.message}`);
    }
  }

  // Find all quizes as a query
  async findAll(
    subject?: string,
    teacher?: string,
    batch?: string,
    grade?: string,
    status?: string,
  ) {
    try {

      const quizzes = await this.quizModel.find({
        subject: subject ? new Types.ObjectId(subject) : { $exists: true },
        teacher: teacher ? new Types.ObjectId(teacher) : { $exists: true },
        batch: batch ? batch : { $exists: true },
        grade: grade ? grade : { $exists: true },
        status: status ? status : { $exists: true },
      })
      .populate({
        path : 'teacher',
        model : 'User',
      })
      .populate({
        path : 'subject',
        model : 'Subject',
      })
      .exec();

      if (quizzes.length === 0) {
        return {
          message: 'No quizzes found',
        }
      }

      return quizzes;

    }catch(err) {
      throw new BadRequestException(`Error: ${err.message}`);
    }
  }

  // Find a quiz by id
  async findOne(quizId: string) {
    try {

      const quiz = await this.quizModel.findById(quizId)
      .populate({
        path : 'teacher',
        model : 'User',
      })
      .populate({
        path : 'subject',
        model : 'Subject',
      })
      .exec();

      if(!quiz) {
        throw new BadRequestException('Quiz not found');
      }

      return quiz;

    }catch(err) {
      throw new BadRequestException(`Error: ${err.message}`);
    }
  }





}


