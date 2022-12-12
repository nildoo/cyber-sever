import { prop, modelOptions, getModelForClass, pre } from '@typegoose/typegoose'
import { hash } from 'bcrypt'
import { Field, InputType, ObjectType } from 'type-graphql'

@pre<Admin>('save', async function () {
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
export class Admin {
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
  public office: string

  @Field(() => String)
  @prop({ required: true, type: String })
  public role: 'admin' | 'consultant'

  @prop({ required: true, type: String })
    password: string
}

export const AdminModel = getModelForClass<typeof Admin>(Admin)

@InputType()
export class AddAdminInput {
  @Field(() => String)
  public name: string

  @Field(() => String)
  public email: string

  @Field(() => String)
  public role: 'admin' | 'consultant'

  @Field(() => String)
  public password: string
}
