import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Batch } from './entities/batch.entity';
import { Model } from 'mongoose';
import { Quiz } from 'src/quiz/entities/quiz.entity';

@Injectable()
export class BatchService {

  constructor(
    @InjectModel(Batch.name) private batchModel: Model<Batch>,
    @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
  ) {}

  async create(createBatchDto: CreateBatchDto) {
    try {

      const batch = await this.batchModel.findOne({ name: createBatchDto.name });
      if (batch) {
        throw new BadRequestException('Batch already exists');
      }

      const newBatch = await this.batchModel.create(createBatchDto);
      return newBatch;

    } catch (error) {
      throw new BadRequestException(`Error: ${error.message}`);
    }
  }

  // update method
  async update(updateBatchDto: CreateBatchDto, id: string) {
    try {
      const batch = await this.batchModel.findById(id);
      if (!batch) {
        throw new BadRequestException('Batch not found');
      }

      batch.name = updateBatchDto.name;
      batch.save();

      return batch;

    } catch (error) {
      throw new BadRequestException(`Error: ${error.message}`);
    }
  }

  // findAll method
  async findAll() {
    try {
      const batches = await this.batchModel.find();
      return batches;

    } catch (error) {
      throw new BadRequestException(`Error: ${error.message}`);
    }
  }

  // remove method
  async remove(id: string) {
    try {
      const batch = await this.batchModel.findById(id);
      if (!batch) {
        throw new BadRequestException('Batch not found');
      }

      // check batch exist in quiz
      const quiz = await this.quizModel.findOne({ batch : batch.name });
      if (quiz) {
        throw new BadRequestException('Batch exist in quiz');
      }

      await this.batchModel.findByIdAndDelete(id);
      return batch;

    } catch (error) {
      throw new BadRequestException(`Error: ${error.message}`);
    }
  }



}
