import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/enums/user.enum';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User extends Document {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, unique: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ default: Role.STUDENT, enum: Role, type: String })
  role: Role;

  @Prop({ type: String, required: false })
  grade: string;

  @Prop({
    type: String,
    default: 'active',
    enum: ['active', 'inactive'],
    required: false,
  })
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
