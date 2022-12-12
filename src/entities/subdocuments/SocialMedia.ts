import { prop } from '@typegoose/typegoose'
import { Field, Float, InputType, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class Result {
  @Field(() => String, { nullable: true })
  public _id?: string

  @Field(() => String)
  @prop({ required: true, type: String })
  public title: string

  @Field(() => Int)
  @prop({ required: true, type: Number })
  public value: number
}

@ObjectType()
export class AdResults {
  @Field(() => String, { nullable: true })
  public _id?: string

  @Field(() => [Result])
  @prop({ type: [Result] })
  public costPerResults: Result[]

  @Field(() => Float)
  @prop({ required: true, type: Number })
  public amountSpent: number

  @Field(() => [Result])
  @prop({ type: [Result] })
  public results: Result[]

  @Field(() => Int)
  @prop({ required: true, type: Number })
  public reach: number
}

@ObjectType()
export class SocialMedia {
  @Field(() => String, { nullable: true })
  public _id?: string

  @Field(() => String)
  @prop({ required: true, type: String })
  public name: string

  @Field(() => AdResults, { nullable: true })
  @prop({ type: AdResults })
  public adResults?: AdResults
}

@InputType()
export class AddResultInput {
  @Field(() => String)
    title: string

  @Field(() => Int)
    value: number
}

@InputType()
export class AddAdResultInput {
  @Field(() => [AddResultInput])
    costPerResults: AddResultInput[]

  @Field(() => Float)
    amountSpent: number

  @Field(() => [AddResultInput])
    results: AddResultInput[]

  @Field(() => Int)
    reach: number
}
