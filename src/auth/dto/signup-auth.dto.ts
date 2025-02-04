import { IsEmail, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class SignupDto {

    @IsString()
    name: string;

    @IsEmail(
        {},
        {message: 'Invalid email'}
    )
    email: string;

    @IsString(
        {message: 'Invalid password'}
    )
    @MinLength(6)
    @Matches(/^(?=.*[0-9])/,{message: 'Password must contain at least one number'})
    password: string;

    @IsString()
    role: string;

    @IsString()
    grade: string;

    @IsString()
    batch: string;

    @IsString()
    status: string;



}

