import { PartialType } from '@nestjs/mapped-types';
import { CreateSubjectDto } from './create-subject.dto';
import { IsString } from 'class-validator';

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {
    @IsString()
    status: string; 
}
