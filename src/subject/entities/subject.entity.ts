import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Subject extends Document {

    @Prop({ required: true, type: String })
    name: string;

    @Prop({ required: true, type: String})
    code: string;

    @Prop({ required: false, type: String, default: 'No discription available' })
    description: string;

    @Prop({ 
        type: String,
        default: 'active',
        enum: ['active', 'inactive'],
        required: false,
    })
    status: string;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
