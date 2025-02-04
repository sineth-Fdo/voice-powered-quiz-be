import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Batch {
    @Prop({ required: true, unique: true, trim: true, type: String })
    name: string;
}

export const BatchSchema = SchemaFactory.createForClass(Batch);