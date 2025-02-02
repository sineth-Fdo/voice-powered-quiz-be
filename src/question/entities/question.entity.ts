import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Question extends Document {
    @Prop({ 
        required: true,
        type: Types.ObjectId,
        ref: 'Quiz',
        
    })
    quiz: Types.ObjectId;

    @Prop({ required: true, type: Number })
    questionNumber: number;

    @Prop({ required: true, type: String })
    question: string;

    @Prop({ required: true, type: String })
    correctAnswer: string;

    @Prop({ 
        required: true, 
        type: [{
            option: String,
        }],
    })
    options: {
        option: string;
    }[];

    @Prop({ required: true, type: Number })
    marks: number;


}

export const QuestionSchema = SchemaFactory.createForClass(Question);
