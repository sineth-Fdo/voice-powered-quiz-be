import { IsEnum, IsString } from "class-validator";

export class CreateSubjectDto {

    @IsString()
    name : string;

    @IsString()
    code : string;

    @IsString()
    description : string;

    @IsString()
    @IsEnum(['active', 'inactive'])
    status : string;
}
