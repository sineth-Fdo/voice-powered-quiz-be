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

    @Prop({ type: Number, required: true })
    duration: number

    @Prop({ type: Number, required: true })
    totalMarks: number

    @Prop({ type: Number, required: true })
    passingMarks: number

    @Prop({ type: Date, required: false, default: Date.now })
    startDate: Date

    @Prop({ type: Date, required: false, default: Date.now })
    endDate: Date


}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
