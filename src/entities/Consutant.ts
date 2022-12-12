import { prop, modelOptions, getModelForClass, pre } from '@typegoose/typegoose'
import { hash } from 'bcrypt'
import { IsEmail } from 'class-validator'
import { Field, InputType, ObjectType } from 'type-graphql'

@pre<Consultant>('save', async function () {
  if (!this.isModified('password')) return
  if (this.password) {
    const hashedPassword = await hash(this.password, 8)
    this.password = hashedPassword
  }
})
@pre<Consultant>('findOneAndUpdate', async function () {
  const update = this.getUpdate() as { password: string }
  if (!update.password) return
  const hashedPassword = await hash(update.password, 8)
  update.password = hashedPassword
})
@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
@ObjectType()
export class Consultant {
  @Field(() => String, { nullable: true })
  public _id?: string

  @Field(() => String)
  @prop({ required: true, type: String })
  public name: string

  @Field(() => String)
  @prop({ required: true, unique: true, type: String })
  public email: string

  @Field(() => String)
  @prop({ required: true, type: String })
  public office: 'social_media' | 'client_success' | 'designer' | 'traffic' | 'adverts'

  @Field(() => String)
  @prop({ required: true, type: String })
  public role: 'admin' | 'consultant'

  @prop({ required: true, type: String })
    password: string
}

export const ConsultantModel = getModelForClass<typeof Consultant>(Consultant)

@InputType()
export class AddConsultantInput {
  @Field(() => String)
  public name: string

  @Field(() => String)
  @IsEmail()
  public email: string

  @Field(() => String)
  public role: 'admin' | 'consultant'

  @Field(() => String)
  public office: 'social_media' | 'client_success' | 'designer' | 'traffic' | 'adverts'

  @Field(() => String)
  public password: string
}
@InputType()
export class UpdatePasswordInput {
  @Field(() => String)
  public consultantId: string

  @Field(() => String)
  public password: string
}

// - Nome:
// - Cargo (Caixa Suspensa): Social Media, Sucesso do Cliente, Designer, Tráfego e Anúncios
// - E-mail Institucional:
