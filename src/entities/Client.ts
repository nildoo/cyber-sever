import { Consultant } from './Consutant'
import { ContractType } from './subdocuments/ContractType'
import { hash } from 'bcrypt'
import { getModelForClass, modelOptions, mongoose, pre, prop, Ref } from '@typegoose/typegoose'
import { Field, InputType, Int, ObjectType } from 'type-graphql'
import { ClientAddress } from './subdocuments/ClientAddress'
import { ExtraContracts } from './subdocuments/ExtraContracts'
import { IsEmail } from 'class-validator'
import { Network } from './subdocuments/Network'
import { ClientContext } from '../services/ClientService'

@pre<Client>('save', async function () {
  if (!this.isModified('password')) return
  if (this.password) {
    const hashedPassword = await hash(this.password, 8)
    this.password = hashedPassword
  }
})
@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
@ObjectType()
export class Client {
  @Field(() => String, { nullable: true })
  public _id?: string

  @Field(() => String)
  @prop({ required: true, type: String })
  public name: string

  @Field(() => String)
  @prop({ type: String })
  public notificationId?: string

  @Field(() => String)
  @prop({ required: true, type: String, unique: true })
  public email: string

  @Field(() => String)
  @prop({ required: true, type: String })
  public cnpj: string

  @Field(() => ContractType)
  @prop({ required: true, type: ContractType })
  public contractType: ContractType

  @Field(() => ClientAddress)
  @prop({ required: true, type: ClientAddress })
  public address: ClientAddress

  @Field(() => String)
  @prop({ required: true, type: String })
  public phone: string

  @Field(() => String)
  @prop({ required: true, type: String })
  public whatsapp: string

  @Field(() => ExtraContracts)
  @prop({ required: true, type: ExtraContracts })
  public othersContracts: ExtraContracts

  @Field(() => [Network])
  @prop({ type: [Network] })
  public networks: Network[]

  @Field(() => Consultant)
  @prop({
    required: true,
    ref: () => Consultant,
    type: mongoose.Schema.Types.ObjectId
  })
  public consultant: Ref<Client>

  @prop({ required: true, type: String })
  public password: string
}

export const ClientModel = getModelForClass<typeof Client>(Client)

@InputType()
class AddressInput {
  @Field(() => String)
  public zipcode: string

  @Field(() => String)
  public street: string

  @Field(() => String)
  public city: string

  @Field(() => String)
  public neighborhood: string

  @Field(() => String)
  public state: string

  @Field(() => String, { nullable: true })
  public number: string

  @Field(() => String, { nullable: true })
  public complement: string
}

@InputType()
class ContractsInput {
  @Field(() => Boolean, { defaultValue: false })
  public extra_art: boolean

  @Field(() => Boolean, { defaultValue: false })
  public extra_network: boolean

  @Field(() => Boolean, { defaultValue: false })
  public landing_page: boolean

  @Field(() => Boolean, { defaultValue: false })
  public site_development: boolean

  @Field(() => Boolean, { defaultValue: false })
  public site_maintenance: boolean
}

@InputType()
export class ContractTypeInput {
  @Field(() => String)
  public type: 'quarterly' | 'automatic'

  @Field(() => String)
  public title: string
}

@InputType()
export class AddClientInput {
  @Field(() => String)
  public name: string

  @Field(() => String)
  @IsEmail()
  public email: string

  @Field(() => String)
  public cnpj: string

  @Field(() => ContractTypeInput)
  public contractType: ContractTypeInput

  @Field(() => AddressInput)
  public address: AddressInput

  @Field(() => String)
  public phone: string

  @Field(() => String)
  public whatsapp: string

  @Field(() => ContractsInput)
  public othersContracts: ContractsInput

  @Field(() => String)
  public consultant: string

  @Field(() => String)
  public password: string
}

@InputType()
export class UpdateClientInput {
  @Field(() => String)
  public id: string

  @Field(() => String)
  public name: string

  @Field(() => String)
  public cnpj: string

  @Field(() => ContractTypeInput)
  public contractType: ContractTypeInput

  @Field(() => AddressInput)
  public address: AddressInput

  @Field(() => String)
  public phone: string

  @Field(() => String)
  public whatsapp: string

  @Field(() => ContractsInput)
  public othersContracts: ContractsInput
}

@InputType()
export class NetworkInput {
  @Field(() => String)
  public id: string

  @Field(() => String)
  public name: string

  @Field(() => Int)
  public followers: number

  @Field(() => Int)
  public likes: number

  @Field(() => Int)
  public comments: number

  @Field(() => Int)
  public reached: number

  @Field(() => Int)
  public posts: number

  @Field(() => Int)
  public profileViews: number
}

@InputType()
export class SignInServiceClientInput {
  @IsEmail()
  @Field(() => String)
    email: string

  @Field(() => String)
    password: string
}

@ObjectType()
export class CLientContextData implements ClientContext {
  @Field(() => String)
    _id: string

  @Field(() => String)
    email: string
}

@InputType()
export class HistoryInputService {
  @Field(() => String)
  public id: string

  @Field(() => String)
  public name: string

  @Field(() => Date, { nullable: true })
  public date?: Date

  @Field(() => String)
  public type: 'followersHistory' | 'likesHistory' | 'commentsHistory' | 'reachedHistory' | 'profileViewsHistory' | 'postsHistory'
}

@InputType()
export class HistoryInput {
  @Field(() => String)
  public id: string

  @Field(() => Date, { nullable: true })
  public date?: Date

  @Field(() => String)
  public name: string
}

@InputType()
export class SetNotificationIdInput {
  @Field(() => String)
  public client_id: string

  @Field(() => String)
  public notificationId: string
}
