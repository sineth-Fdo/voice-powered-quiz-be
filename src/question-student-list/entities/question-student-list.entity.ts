import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
})
export class QuestionStudentList extends Document {

    @Prop({
        required: false,
        type: Types.ObjectId,
        ref: 'Question',
    })
    question : Types.ObjectId;

    @Prop({ required: false, type: Array, default: [] })
    correct : string[];


    @Prop({ required: false, type: Array, default: [] })
    incorrect : string[];

}

export const QuestionStudentListSchema = SchemaFactory.createForClass(QuestionStudentList);
