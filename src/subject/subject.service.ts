import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Subject } from './entities/subject.entity';
import { Model } from 'mongoose';

@Injectable()
export class SubjectService {

    constructor(
        @InjectModel(Subject.name) private SubjectModel: Model<Subject>,
    ) {}

    // Create a new subject
    async createSubject(createSubjectDto: any) {
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

            await this.SubjectModel.findByIdAndDelete(id);

            return { message: 'Subject deleted successfully' };
        }catch(err) {
            throw new BadRequestException(`Error: ${err.message}`);
        }
    }

    // Update a subject
    async updateSubject(id: string, createSubjectDto: any) {
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
