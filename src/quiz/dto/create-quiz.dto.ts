import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateQuizDto {
    @IsString()
    title: string;

    @IsString()
    code: string;

    @IsString()
    description: string;

    @IsString()
    password: string;

    @IsString()
    @IsEnum(['not-started', 'started', 'completed'])
    status: string;

    @IsString()
    teacher: string;

    @IsString()
    subject: string;

    @IsString()
    grade: string;

    @IsString()
    batch: string;

    @IsNumber()
    duration: number;

    @IsNumber()
    durationHours: number;

    @IsNumber()
    durationMinutes: number;

    @IsNumber()
    quizTotalMarks: number;

    @IsNumber()
    quizTotalQuestions: number;

    @IsNumber()
    passingMarks: number;

    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    startDate: String;

    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    startTime: String;

    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    endTime: String;
    
}
