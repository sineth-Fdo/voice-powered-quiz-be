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

    @Prop({ required: false, type: [
      {
        studentId : Types.ObjectId,
      }
    ], default: [] })
    correct : {
      studentId : Types.ObjectId,
    }[];


    @Prop({ required: false, type: [
      {
        studentId : Types.ObjectId
      }
    ], default: [] })
    incorrect : {
      studentId : Types.ObjectId,
    }[];

}

export const QuestionStudentListSchema = SchemaFactory.createForClass(QuestionStudentList);
