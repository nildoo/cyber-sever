import { prop } from '@typegoose/typegoose'
import { Field, Float, InputType, ObjectType } from 'type-graphql'

@ObjectType()
export class File {
  @Field(() => String, { nullable: true })
  public _id?: string

  @Field(() => String)
  @prop({ required: true, type: String })
  public title: string

  @Field(() => String)
  @prop({ required: true, type: String })
  public type: string

  @Field(() => String)
  @prop({ required: true, type: String })
  public folder: string

  @Field(() => String)
  @prop({ required: true, type: String })
  public firebasePath: string

  @Field(() => String)
  @prop({ required: true, type: String })
  public thumb: string

  @Field(() => String)
  @prop({ required: true, type: String })
  public url: string

  @Field(() => Boolean)
  @prop({ required: true, type: Boolean, default: false })
  public approved: boolean

  @Field(() => Float)
  @prop({ required: true, type: Number })
  public size: number
}

@ObjectType()
export class Files {
  @Field(() => String, { nullable: true })
  public _id?: string

  @Field(() => [File])
  @prop({ type: [File] })
  public images: File[]

  @Field(() => [File])
  @prop({ type: [File] })
  public videos: File[]

  @Field(() => [File])
  @prop({ type: [File] })
  public signature: File[]
}

@InputType()
export class AddFileInput {
  @Field(() => String)
    id: string

  @Field(() => String)
    title: string

  @Field(() => String)
    type: string

  @Field(() => String)
    thumb: string

  @Field(() => String)
    url: string

  @Field(() => Float)
    size: number
}

@InputType()
export class AddImagesInput {
  @Field(() => [AddFileInput])
    approved: AddFileInput[]

  @Field(() => [AddFileInput])
    rejected: AddFileInput[]
}

@InputType()
export class AddVideosInput {
  @Field(() => [AddFileInput])
    approved: AddFileInput[]

  @Field(() => [AddFileInput])
    rejected: AddFileInput[]
}

@InputType()
export class AddFilesInput {
  @Field(() => [AddImagesInput])
    images: AddImagesInput[]

  @Field(() => [AddVideosInput])
    videos: AddVideosInput[]

  @Field(() => [AddFileInput])
    signature: AddFileInput[]
}
