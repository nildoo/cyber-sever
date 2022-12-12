import { AuthServiceMain } from '../services/AuthServiceMain'
import { SignInInputMain, TokenDash, UserInContext } from '../entities/Auth'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import Context from '../context/context'

@Resolver()
export class AuthResolver {
  constructor (
    private readonly authServiceMain: AuthServiceMain
  ) {
    this.authServiceMain = new AuthServiceMain()
  }

  @Query(() => UserInContext, { nullable: true })
  @Authorized()
  async getMe (@Ctx() context: Context): Promise<UserInContext | null> {
    if (context.user) {
      const data = {
        id: context.user._id,
        role: context.user.role
      }
      return await this.authServiceMain.getMeInContext(data)
    }
    return null
  }

  @Mutation(() => TokenDash)
  async signIn (@Arg('input', () => SignInInputMain) input: SignInInputMain): Promise<TokenDash | null> {
    return await this.authServiceMain.SignIn(input)
  }
}
