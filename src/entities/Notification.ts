import { prop, getModelForClass } from '@typegoose/typegoose'
import { Field, InputType, ObjectType } from 'type-graphql'

@ObjectType()
export class Notification {
  @Field(() => String, { nullable: true })
  public _id?: string

  @Field(() => String)
  @prop({ type: String })
  public client?: String

  @Field(() => String)
  @prop({ type: String })
  public consultant?: String

  @Field(() => String)
  @prop({ required: true, type: String })
  public message: string

  @Field(() => String)
  @prop({ required: true, type: String })
  public title: string

  @Field(() => Date, { nullable: true })
  public createdAt?: Date

  @Field(() => Date, { nullable: true })
  public updatedAt?: Date
}

export const NotificationModel = getModelForClass<typeof Notification>(Notification)

@InputType()
export class AddNotificationInput {
  @Field(() => String)
  public client: string

  @Field(() => String)
  public message: string

  @Field(() => String)
  public title: string
}
