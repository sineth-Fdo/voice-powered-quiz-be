import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { CreateQuizStudentDto } from './dto/create-quiz-student.dto';
import { QuizStudent } from './entities/quiz-student.entity';
import { Question } from 'src/question/entities/question.entity';

@Injectable()
export class QuizStudentService {

    constructor(
        @InjectModel(QuizStudent.name) private quizStudentModel: Model<QuizStudent>,
        @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Question.name) private questionModel: Model<Question>,
    ) {}

    // Create a new quiz-student
    async create(createQuizStudentDto: CreateQuizStudentDto) {
        try {
            
            const quiz = await this.quizModel.findOne({ _id : createQuizStudentDto.quiz });
            if(!quiz) {
                throw new Error('Quiz not found');
            }

            const teacher = await this.userModel.findOne({ _id : createQuizStudentDto.teacher });
            if(!teacher) {
                throw new Error('Teacher not found');
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
                    teacher : new Types.ObjectId(createQuizStudentDto.teacher),
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

    // Delete all quiz-student with this quizId
    async deleteAllQuizStudents(quizId: string) {
        try {

            // find all quiz-student with this quizId
            await this.quizStudentModel.deleteMany({
                quiz : new Types.ObjectId(quizId),
            });

            return {
                message: 'All quiz-students deleted successfully',
            };

        } catch (error) {
            console.error('Error deleting quiz-students:', error);
            throw new Error(error.message);
        }
    }

    // update student answer marks and counts in quiz-student
    async updateStudentAnswerMarksAndCounts(quizId: string, studentId: string, questionId: string, correct: boolean, studentAnswer: string) {
        try {

            const quizStudent = await this.quizStudentModel.findOne({
                quiz : new Types.ObjectId(quizId),
                student : new Types.ObjectId(studentId),
            });
            if(!quizStudent) {
                throw new Error('Quiz-Student not found');
            }

            // find this question in quiz-student answeredQuestions array
            const answeredQuestion = quizStudent.answeredQuestions.find(
                answeredQuestion => answeredQuestion.questionId.toString() === questionId
            );
            if(answeredQuestion) {
                throw new Error('Question already answered');
            }


            // get question marks
            const question = await this.questionModel.findOne({ _id: questionId });
            if(!question) {
                throw new Error('Question not found');
            }

            // get question marks
            const marks = question.marks;
            const previousCorrectMarks = quizStudent.correctMarks;
            const previousIncorrectMarks = quizStudent.incorrectMarks;
            const previousCorrectAnswers = quizStudent.correctAnswers;
            const previousIncorrectAnswers = quizStudent.incorrectAnswers;

            // find and update student answer marks and counts
            if(correct) {
                quizStudent.correctMarks = previousCorrectMarks + marks;
                quizStudent.correctAnswers = previousCorrectAnswers + 1;
            } else {
                quizStudent.incorrectMarks = previousIncorrectMarks + marks;
                quizStudent.incorrectAnswers = previousIncorrectAnswers + 1;                
            }
            await quizStudent.save();

            quizStudent.totalMarks = quizStudent.correctMarks;
            quizStudent.totalQuestions = quizStudent.correctAnswers + quizStudent.incorrectAnswers;
            quizStudent.attempted = true;

            // student id and answer push to quizStudents answeredQuestions array
            quizStudent.answeredQuestions.push({
                questionId : new Types.ObjectId(questionId),
                answer : studentAnswer,
            });

            await quizStudent.save();
        

        } catch (error) {
            throw new Error(error.message);
        }
    }

    // async findAll(quizId: string, student?: string, teacher?: string) {
    //     try {
    //         let query: any = {};
            
    //         // Add filters to the basic query
    //         if (quizId) {
    //             query.quiz = new Types.ObjectId(quizId);
    //         }
            
    //         if (student) {
    //             query.student = new Types.ObjectId(student);
    //         }
            
    //         // First get quizStudents with basic filters
    //         let quizStudents = await this.quizStudentModel.find(query)
    //             .populate({
    //                 path: 'quiz',
    //                 model: 'Quiz',
    //                 // Apply teacher filter during population
    //                 ...(teacher && { match: { teacher: new Types.ObjectId(teacher) } })
    //             })
    //             .populate({
    //                 path: 'student',
    //                 model: 'User',
    //             })
    //             .populate({
    //                 path: 'answeredQuestions.questionId',
    //                 model: 'Question',
    //             })
    //             .exec();
                
    //         // Filter out results where quiz is null (happens when populate match fails)
    //         if (teacher) {
    //             quizStudents = quizStudents.filter(item => item.quiz !== null);
    //         }
    
    //         if(quizStudents.length === 0) {
    //             return {
    //                 message: 'No quiz-students found',
    //             };
    //         }
    
    //         return quizStudents;
    //     } catch (error) {
    //         console.log('FindAll error:', error);
    //         throw new Error(error.message);
    //     }
    // }

    // find all quiz-student by query
    async findAll(quizId: string, student?: string, teacherId?: string) {
        try {
            const quizStudents = await this.quizStudentModel.find({
                quiz : quizId ? new Types.ObjectId(quizId) : { $exists: true },
                student : student ? new Types.ObjectId(student) : { $exists: true },   
                teacher : teacherId ? new Types.ObjectId(teacherId) : { $exists: true }, 
            })
            // .populate({
            //     path : 'quiz',
            //     model : 'Quiz',
            // })
            // .populate({
            //     path : 'student',
            //     model : 'User',
            // })
            // .populate({
            //     path : 'answeredQuestions.questionId',
            //     model : 'Question',
            // })
            // .exec();

            if(quizStudents.length === 0) {
                return {
                    message: 'No quiz-students found',
                };
            }

            return quizStudents;

        } catch (error) {
            throw new Error(error.message);
        }
    }

    // find quiz-student by quizId and studentId
    async findOne(quizId: string, studentId: string) {
        try {
            const quizStudent = await this.quizStudentModel.findOne({
                quiz : new Types.ObjectId(quizId),
                student : new Types.ObjectId(studentId),
            })
            .populate({
                path : 'quiz',
                model : 'Quiz',
            })
            .populate({
                path : 'student',
                model : 'User',
            })
            .populate({
                path : 'answeredQuestions.questionId',
                model : 'Question',
            })
            .exec();

            if(!quizStudent) {
                return {
                    message: 'Quiz-Student not found',
                };
            }

            return quizStudent;

        } catch (error) {
            throw new Error(error.message);
        }
    }


}
