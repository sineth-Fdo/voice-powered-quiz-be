import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Quiz extends Document {

    @Prop({ required: true, type: String })
    title: string;

    @Prop({ required: true, type: String})
    code: string;

    @Prop({ required: false, type: String, default: 'No discription available' })
    description: string;

    @Prop({ required: true, type: String })
    password: string;

    @Prop({ 
        type: String,
        default: 'not-started',
        enum: ['not-started', 'started', 'completed'],
        required: false,
    })
    status: string;

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    })
    teacher: Types.ObjectId; 

    @Prop({
        type: Types.ObjectId,
        ref: 'Subject',
        required: true,
    })
    subject: Types.ObjectId;
    
    @Prop({ type: String, required: true })
    grade: string 

    @Prop({ type: String, required: true })
    batch: string

    @Prop({ type: Number, required: false })
    duration: number

    @Prop({ type: Number, required: false })
    durationHours : number

    @Prop({ type: Number, required: false })
    durationMinutes: number

    @Prop({ type: Number, required: true })
    totalMarks: number

    @Prop({ type: Number, required: true })
    passingMarks: number

    @Prop({ type: String, required: false })
    startDate: String

    @Prop({ type: String, required: false })
    startTime: String

    @Prop({ type: String, required: false })
    endTime: String


}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
