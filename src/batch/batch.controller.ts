import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BatchService } from './batch.service';
import { CreateBatchDto } from './dto/create-batch.dto';

@Controller('batch')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Post('create')
  create(@Body() createBatchDto: CreateBatchDto) {
    return this.batchService.create(createBatchDto);
  }

  @Put('update/:id')
  update(
    @Body() createBatchDto: CreateBatchDto,
    @Param('id') id: string
  ) {
    return this.batchService.update(createBatchDto, id);
  }

  @Get('all')
  findAll() {
    return this.batchService.findAll();
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.batchService.remove(id);
  }
}
