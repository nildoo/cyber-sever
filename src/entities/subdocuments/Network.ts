import { prop } from '@typegoose/typegoose'
import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class Insight {
  @Field(() => Date, { nullable: true })
  @prop({ type: Date, default: Date.now() })
  public date?: Date

  @Field(() => Int)
  @prop({ required: true, type: Number })
  public quantity: number
}

@ObjectType()
export class Insights {
  @Field(() => String, { nullable: true })
  public _id: string

  @Field(() => Int)
  @prop({ required: true, type: Number })
  public followers: number

  @Field(() => [Insight])
  @prop({ required: true, type: [Insight] })
  public followersHistory: Insight[]

  @Field(() => Int)
  @prop({ required: true, type: Number })
  public likes: number

  @Field(() => [Insight])
  @prop({ required: true, type: [Insight] })
  public likesHistory: Insight[]

  @Field(() => Int)
  @prop({ required: true, type: Number })
  public comments: number

  @Field(() => [Insight])
  @prop({ required: true, type: [Insight] })
  public commentsHistory: Insight[]

  @Field(() => Int)
  @prop({ required: true, type: Number })
  public reached: number

  @Field(() => [Insight])
  @prop({ required: true, type: [Insight] })
  public reachedHistory: Insight[]

  @Field(() => Int)
  @prop({ required: true, type: Number })
  public posts: number

  @Field(() => [Insight])
  @prop({ required: true, type: [Insight] })
  public postsHistory: Insight[]

  @Field(() => Int)
  @prop({ required: true, type: Number })
  public profileViews: number

  @Field(() => [Insight])
  @prop({ required: true, type: [Insight] })
  public profileViewsHistory: Insight[]
}

@ObjectType()
export class Network {
  @Field(() => String, { nullable: true })
  public _id: string

  @Field(() => String)
  @prop({ required: true, type: String })
  public name: string

  @Field(() => Date)
  @prop({ required: true, type: Date })
  public lastUpdate: Date

  @Field(() => Insights)
  @prop({ required: true, type: Insights })
  public insights: Insights
}
