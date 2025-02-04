import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Batch } from './entities/batch.entity';
import { Model } from 'mongoose';

@Injectable()
export class BatchService {

  constructor(
    @InjectModel(Batch.name) private batchModel: Model<Batch>,
  ) {}

  async create(createBatchDto: CreateBatchDto) {
    try {

      console.log(createBatchDto);
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

}
