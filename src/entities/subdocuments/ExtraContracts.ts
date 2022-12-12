import { prop } from '@typegoose/typegoose'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class ExtraContracts {
  @Field(() => String, { nullable: true })
  public _id: string

  @Field(() => Boolean, { defaultValue: false })
  @prop({ type: Boolean, default: false })
  public extra_art: boolean

  @Field(() => Boolean, { defaultValue: false })
  @prop({ type: Boolean, default: false })
  public extra_network: boolean

  @Field(() => Boolean, { defaultValue: false })
  @prop({ type: Boolean, default: false })
  public landing_page: boolean

  @Field(() => Boolean, { defaultValue: false })
  @prop({ type: Boolean, default: false })
  public site_development: boolean

  @Field(() => Boolean, { defaultValue: false })
  @prop({ type: Boolean, default: false })
  public site_maintenance: boolean
}
