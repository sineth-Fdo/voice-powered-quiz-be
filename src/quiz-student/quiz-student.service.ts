import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QuizStudent } from './entities/quiz-student.entity';
import { Model, Types } from 'mongoose';
import { CreateQuizStudentDto } from './dto/create-quiz-student.dto';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class QuizStudentService {

    constructor(
        @InjectModel(QuizStudent.name) private quizStudentModel: Model<QuizStudent>,
        @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
        @InjectModel(User.name) private userModel: Model<User>,
    ) {}

    // Create a new quiz-student
    async create(createQuizStudentDto: CreateQuizStudentDto) {
        try {
            
            const quiz = await this.quizModel.findOne({ _id : createQuizStudentDto.quiz });
            if(!quiz) {
                throw new Error('Quiz not found');
            }
            
            const student = await this.userModel.findOne({ _id : createQuizStudentDto.student , role: 'student' });
            if(!student) {
                throw new Error('Student not found');
            }
            
            const quizStudent = await this.quizStudentModel.findOne({
                quiz: new Types.ObjectId(createQuizStudentDto.quiz),
                student: new Types.ObjectId(createQuizStudentDto.student),
            });

            if(quizStudent) {
                throw new Error('Quiz-Student already exists');
            }

            const quizId = new Types.ObjectId(createQuizStudentDto.quiz);
            const studentId = new Types.ObjectId(createQuizStudentDto.student);


            // Create a new quiz-student
            await this.quizStudentModel.create({
                quiz : quizId,
                student : studentId,
            });

            return {
                message : "Quiz-Student created successfully",
            };
        } catch (error) {
            return {
                message : error.message,
            };
        }
    }


}
