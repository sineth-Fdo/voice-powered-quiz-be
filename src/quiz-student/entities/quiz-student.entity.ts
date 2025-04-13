import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
})
export class QuizStudent extends Document {

    @Prop({
        type: Types.ObjectId,
        ref: 'Quiz',
        required: true,
    })
    quiz: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    })
    student: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    })
    teacher: Types.ObjectId;

    @Prop({ type: Number, required: false, default: 0 })
    correctMarks: number

    @Prop({ type: Number, required: false, default: 0 })
    incorrectMarks: number

    @Prop({ type: Number, required: false, default: 0 })
    correctAnswers: number

    @Prop({ type: Number, required: false, default: 0 })
    incorrectAnswers: number

    @Prop({ type: Boolean, required: false, default: false })
    attempted: boolean

    @Prop({ type: Number, required: false, default: 0 })
    totalQuestions: number

    @Prop({ type: Number, required: false, default: 0 })
    totalMarks: number

    @Prop({ 
        type: [{
            questionId: Types.ObjectId,
            answer: String,
        }],
        required: false,
    })
    answeredQuestions: {
            questionId: Types.ObjectId,
            answer: String,
    }[];

}

export const QuizStudentSchema = SchemaFactory.createForClass(QuizStudent);