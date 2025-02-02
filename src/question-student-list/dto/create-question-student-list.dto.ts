import { IsArray, IsString } from "class-validator";

export class CreateQuestionStudentListDto {

    @IsString()
    question : string;

    @IsArray()
    correct : string[];

    @IsArray()
    incorrect : string[];

}
