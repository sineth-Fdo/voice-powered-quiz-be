import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { Subject } from './entities/subject.entity';

@Injectable()
export class SubjectService {

    constructor(
        @InjectModel(Subject.name) private SubjectModel: Model<Subject>,
        @InjectModel(Quiz.name) private quizModel: Model<Quiz>
    ) {}

    // Create a new subject
    async createSubject(createSubjectDto: CreateSubjectDto) {
        try {
            const subjectExist = await this.SubjectModel.findOne({ code: createSubjectDto.code });
            if(subjectExist) {
                throw new BadRequestException('Subject code is already exist');
            }

            const subject = new this.SubjectModel(createSubjectDto);
            const savedSubject = await subject.save();
            return savedSubject.toJSON();
        }catch(err) {
            throw new BadRequestException(`Error: ${err.message}`);
        }
    }

    // Remove a subject
    async removeSubject(id: string) {
        try {
            const subject = await this.SubjectModel.findById(id);
            if(!subject) {
                throw new BadRequestException('Subject not found');
            }

            const quizzes = await this.quizModel.find({ subject: new Types.ObjectId(id) });
            if(quizzes.length > 0) {
                throw new BadRequestException('Subject cannot be deleted because it has quizzes');
            }

            await this.SubjectModel.findByIdAndDelete(id);

            return { message: 'Subject deleted successfully' };
        }catch(err) {
            throw new BadRequestException(`Error: ${err.message}`);
        }
    }

    // Update a subject
    async updateSubject(id: string, createSubjectDto: CreateSubjectDto) {
        try {
            const subject = await this.SubjectModel.findById(id);
            if(!subject) {
                throw new BadRequestException('Subject not found');
            }

            subject.name = createSubjectDto.name;
            subject.code = createSubjectDto.code;
            subject.description = createSubjectDto.description;
            subject.status = createSubjectDto.status;

            const savedSubject = await subject.save();
            return savedSubject.toJSON();
        }catch(err) {
            throw new BadRequestException(`Error: ${err.message}`);
        }
    }

    // Update subject status
    async updateSubjectStatus(id: string, { status }: { status: 'active' | 'inactive' }) {
        try {
            const subject = await this.SubjectModel.findById(id);
            if(!subject) {
                throw new BadRequestException('Subject not found');
            }

            subject.status = status;
            const savedSubject = await subject.save();
            return savedSubject.toJSON();
        }catch(err) {
            throw new BadRequestException(`Error: ${err.message}`);
        }
    }

    // Find a subject by ID
    async findOne(id: string) {
        try {
            const subject = await this.SubjectModel.findById(id);
            if(!subject) {
                throw new BadRequestException('Subject not found');
            }

            return subject.toJSON();
        }catch(err) {
            throw new BadRequestException(`Error: ${err.message}`);
        }
    }

    // Get all subjects
    async findAll() {
        try {
            const subjects = await this.SubjectModel.find();
            if (!subjects) {
                throw new BadRequestException('No subject found');
            }
            return subjects;
        }catch(err) {
            throw new BadRequestException(`Error: ${err.message}`);
        }
    }

}
