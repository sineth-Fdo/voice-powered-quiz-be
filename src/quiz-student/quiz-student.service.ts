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

            // find all G-11 grade students
            const students = await this.userModel.find({ grade: createQuizStudentDto.studentGrade, batch: createQuizStudentDto.studentBatch, role: 'student' });

            if(students.length == 0) {
                throw new Error('Students not found');
            }

            // save all students in to tempery array
            let temp = [];
            students.forEach(student => {
                temp.push({
                    student : new Types.ObjectId(student.id),
                });
            });

            // check if temp quiz-student already exists check one by one
            let quizStudents = [];
            for(let i = 0; i < temp.length; i++) {
                quizStudents.push(await this.quizStudentModel.findOne({
                    quiz: new Types.ObjectId(createQuizStudentDto.quiz),
                    student: temp[i].student,
                }));
            }

            for (let i = 0; i < quizStudents.length; i++) {
                if(quizStudents[i] != null) {
                    throw new Error('Quiz-Student already exists');
                }
            }

            // Create a new quiz-student
            for(let i = 0; i < temp.length; i++) {
                await this.quizStudentModel.create({
                    quiz : new Types.ObjectId(createQuizStudentDto.quiz),
                    student : new Types.ObjectId(temp[i].student),
                });
            }

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
