import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { SubjectService } from './subject.service';

@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post('create')
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.createSubject(createSubjectDto);
  }

  @Delete('remove/:id')
  remove(@Param('id') id: string) {
    return this.subjectService.removeSubject(id);
  }

  @Put('updateAll/:id')
  update(@Param('id') id: string, @Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.updateSubject(id, createSubjectDto);
  }

  @Patch('status/:id')
  updateStatus(
    @Param('id') id: string, 
    @Body('status') status: 'active' | 'inactive',
  ) {
    return this.subjectService.updateSubjectStatus(id, { status });
  }

  @Get('find/:id')
  findOne(@Param('id') id: string) {
    return this.subjectService.findOne(id);
  }

  @Get('findAll')
  findAll() {
    return this.subjectService.findAll();
  }

}
