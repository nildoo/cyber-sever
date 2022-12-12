import { ApolloError } from 'apollo-server-express'
import { signJwt } from '../utils/jwt'
import { compare } from 'bcrypt'
import { ClientService } from './ClientService'
import { SignInServiceClientInput } from '../entities/Client'
import dayjs from 'dayjs'
import { TokenMain } from '../entities/Auth'

export class AuthServiceClient {
  constructor (
    private readonly clientService: ClientService
  ) {
    this.clientService = new ClientService()
  }

  async clientLogin (input: SignInServiceClientInput): Promise<TokenMain> {
    const error = 'Senha ou email inválido.'

    const userResult = await this.clientService.getClientByEmail(input.email)

    if (!userResult) {
      throw new ApolloError(error)
    }

    if (userResult.password) {
      const passwordIsValid = await compare(input.password, userResult.password)
      if (!passwordIsValid) throw new ApolloError(error)
    }

    const token = signJwt({ _id: userResult._id, email: userResult.email, name: userResult.name, date: dayjs().add(30, 'day') }, {
      expiresIn: '30d'
    })

    return { token }
  }
}
