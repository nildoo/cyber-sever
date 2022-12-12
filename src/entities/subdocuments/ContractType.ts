import { prop } from '@typegoose/typegoose'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class ContractType {
  @Field(() => String)
  @prop({ type: String })
  public type: 'quarterly' | 'automatic'

  @Field(() => String)
  @prop({ type: String })
  public title: string
}
