import { prop, getModelForClass, mongoose, Ref, modelOptions } from '@typegoose/typegoose'
import { Field, Float, InputType, Int, ObjectType } from 'type-graphql'
import { Client } from './Client'
import { Consultant } from './Consutant'
import { Files } from './subdocuments/File'
import { SocialMedia } from './subdocuments/SocialMedia'

@ObjectType()
class Link {
  @Field(() => String, { nullable: true })
  public _id?: string

  @Field(() => String)
  @prop({ required: true, type: String })
  public title: string

  @Field(() => String)
  @prop({ required: true, type: String })
  public link: string
}

@ObjectType()
class Meet {
  @Field(() => String)
  @prop({ required: true, type: String })
  public title: string

  @Field(() => Date)
  @prop({ required: true, type: Date })
  public date: Date

  @Field(() => Date)
  @prop({ required: true, type: Date })
  public hour: Date
}
@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
@ObjectType()
export class Campaing {
  @Field(() => String, { nullable: true })
  public _id?: string

  @Field(() => Client)
  @prop({
    required: true,
    ref: () => Client,
    type: mongoose.Schema.Types.ObjectId
  })
  public client: Ref<Client>

  @Field(() => Consultant)
  @prop({
    required: true,
    ref: () => Consultant,
    type: mongoose.Schema.Types.ObjectId
  })
  public consultant: Ref<Consultant>

  @Field(() => String)
  @prop({ required: true, type: String })
  public title: string

  @Field(() => [Link])
  @prop({ required: true, type: [Link] })
  public links: Link[]

  @Field(() => String)
  @prop({ required: true, type: String })
  public type: string

  @Field(() => Meet, { nullable: true })
  @prop({ type: Meet })
  public meet?: Meet

  @Field(() => String)
  @prop({ required: true, type: String })
  public status: string

  @Field(() => Date)
  @prop({ required: true, type: Date })
  public startDate: Date

  @Field(() => Date)
  @prop({ required: true, type: Date })
  public endDate: Date

  @Field(() => [SocialMedia])
  @prop({ type: [SocialMedia] })
  public socialMediasResults: SocialMedia[]

  @Field(() => Files)
  @prop({ required: true, type: [Files] })
  public files: Files
}

export const CampaingModel = getModelForClass<typeof Campaing>(Campaing)

@InputType()
export class AddCampaingInput {
  @Field(() => String)
  public client: string

  @Field(() => String)
  public consultant: string

  @Field(() => String)
  public title: string

  @Field(() => String)
  public type: string

  @Field(() => Date)
  public startDate: Date

  @Field(() => Date)
  public endDate: Date

  @Field(() => [String])
    socialMediaNames: string[]
}

@InputType()
export class AddFileCampaingInput {
  @Field(() => String)
  public id: string

  @Field(() => String)
  public title: string

  @Field(() => String)
  public folder: string

  @Field(() => String)
  public firebasePath: string

  @Field(() => String)
  public type: 'image' | 'video' | 'client'

  @Field(() => String)
  public thumb: string

  @Field(() => String)
  public url: string

  @Field(() => Boolean, { defaultValue: false })
  public approved: boolean

  @Field(() => Float)
  public size: number
}

@InputType()
export class ApproveFileInput {
  @Field(() => String)
  public id_campaing: string

  @Field(() => String)
  public id_file: string

  @Field(() => Boolean)
  public approved: boolean

  @Field(() => String)
  public typeFile: 'image' | 'video'
}

@InputType()
export class AddLinkInput {
  @Field(() => String)
  public id: string

  @Field(() => String)
  public title: string

  @Field(() => String)
  public link: string
}

@InputType()
export class RemoveLinkInput {
  @Field(() => String)
  public campaingId: string

  @Field(() => String)
  public linkId: string
}

@InputType()
export class AddMeetInput {
  @Field(() => String)
  public campaingId: string

  @Field(() => String)
  public title: string

  @Field(() => Date)
  public date: Date
}

@InputType()
export class ResultInput {
  @Field(() => String)
  public title: string

  @Field(() => Int)
  public value: number
}

@InputType()
export class AddResultsCampaingInput {
  @Field(() => String)
  public campaingId: string

  @Field(() => String)
  public network: string

  @Field(() => Float)
  public amountSpent: number

  @Field(() => Int)
  public reach: number

  @Field(() => [ResultInput])
  public costPerResults: ResultInput[]

  @Field(() => [ResultInput])
  public results: ResultInput[]
}

@InputType()
export class RemoveImageCampaingInput {
  @Field(() => String)
  public campaingId: string

  @Field(() => String)
  public fileId: string

  @Field(() => String)
  public folder: 'image' | 'video' | 'client'
}
