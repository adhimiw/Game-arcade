import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password
      delete ret.refreshToken
      return ret
    },
  },
})
export class User {
  @Prop({ required: true, unique: true })
  username: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop()
  firstName?: string

  @Prop()
  lastName?: string

  @Prop({ default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default' })
  avatar: string

  @Prop({ default: 'player' })
  role: string

  @Prop({ default: true })
  isActive: boolean

  @Prop()
  lastLogin?: Date

  @Prop()
  refreshToken?: string

  @Prop({ type: [{ gameId: String, score: Number, achievedAt: Date }] })
  gameStats: Array<{
    gameId: string
    score: number
    achievedAt: Date
  }>
}

export const UserSchema = SchemaFactory.createForClass(User)