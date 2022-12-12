import { IsEmail } from 'class-validator'
import { Field, InputType, ObjectType } from 'type-graphql'

@ObjectType()
export class TokenMain {
  @Field(() => String)
  public token: string
}

@ObjectType()
export class UserInContext {
  @Field(() => String)
  public id: string

  @Field(() => String)
  public name: string

  @Field(() => String)
  public email: string

  @Field(() => String)
  public office: string

  @Field(() => String)
  public role: string
}

@ObjectType()
export class TokenDash {
  @Field(() => String)
  public token: string

  @Field(() => String)
  public role: 'admin' | 'consultant'
}

export interface UserContext {
  _id: string
  email: string
  role: string
}

@ObjectType()
export class UserToken {
  @Field(() => String)
  public token: string

  @Field(() => String)
  public userId?: string
}

@InputType()
export class SignInInputMain {
  @IsEmail()
  @Field(() => String)
    email: string

  @Field(() => String)
    password: string
}

@ObjectType()
export class User {
  @Field(() => String, { nullable: true })
  public _id?: string

  @Field(() => String)
  public email: string

  @Field(() => String)
  public role: string
}
