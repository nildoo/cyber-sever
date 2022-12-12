import Context from '../context/context'
import { User } from '../entities/Auth'
import { verifyJwt } from './jwt'

export const authentication = async (ctx: Context): Promise<Context> => {
  const context = ctx

  const authToken = ctx.req.headers.authorization as string

  if (authToken) {
    const token = authToken.replace('Bearer ', '')
    const user = verifyJwt<User>(token)

    if (user !== null) {
      if (user._id) {
        context.user = {
          _id: user._id,
          email: user.email,
          role: user.role
        }
      }
    }
  }

  return context
}
