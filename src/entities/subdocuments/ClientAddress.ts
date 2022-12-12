import { prop } from '@typegoose/typegoose'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class ClientAddress {
  @Field(() => String, { nullable: true })
  public _id: string

  @Field(() => String)
  @prop({ required: true, type: String })
  public zipcode: string

  @Field(() => String)
  @prop({ required: true, type: String })
  public street: string

  @Field(() => String)
  @prop({ required: true, type: String })
  public city: string

  @Field(() => String)
  @prop({ required: true, type: String })
  public neighborhood: string

  @Field(() => String)
  @prop({ required: true, type: String })
  public state: string

  @Field(() => String, { nullable: true })
  @prop({ type: String })
  public number: string

  @Field(() => String, { nullable: true })
  @prop({ type: String })
  public complement: string
}
