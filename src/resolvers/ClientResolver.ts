import { NetworkInput, HistoryInput, SignInServiceClientInput, SetNotificationIdInput } from './../entities/Client'
import { ClientService } from './../services/ClientService'
import { Arg, Authorized, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver } from 'type-graphql'
import { AddClientInput, Client, UpdateClientInput } from '../entities/Client'
import { AuthServiceClient } from '../services/AuthServiceClient'
import Context from '../context/context'
import { AddNotificationInput } from '../entities/Notification'

@ObjectType()
class History {
  @Field(() => String)
  public networkType: string

  @Field(() => [Number])
  public week: number[]

  @Field(() => [Number])
  public year: number[]
}

@ObjectType()
export class ClientToken {
  @Field(() => String)
  public token: string
}
@Resolver(() => Client)
export class ClientResolver {
  constructor (
    private readonly clientService: ClientService,
    private readonly authServiceClient: AuthServiceClient
  ) {
    this.clientService = new ClientService()
    this.authServiceClient = new AuthServiceClient(clientService)
  }

  @Query(() => [Client])
  @Authorized()
  async clients (@Ctx() context: Context): Promise<Client[]> {
    if (context.user) {
      return await this.clientService.getClients(context.user)
    }
    return []
  }

  @Query(() => Int)
  @Authorized()
  async totalClients (@Ctx() context: Context): Promise<number> {
    if (context.user) {
      return await this.clientService.getTotalClients(context.user)
    }
    return 0
  }

  @Query(() => Client, { nullable: true })
  @Authorized()
  async clientMe (@Ctx() context: Context): Promise<Client | null> {
    if (context.user) {
      const _id = context.user._id
      return await this.clientService.getClientById(_id)
    }
    return null
  }

  @Query(() => Client, { nullable: true })
  @Authorized()
  async client (@Arg('id', () => String) id: string): Promise<Client | null> {
    return await this.clientService.getClientById(id)
  }

  @Mutation(() => ClientToken)
  async clientLogin (@Arg('input', () => SignInServiceClientInput) input: SignInServiceClientInput): Promise<ClientToken> {
    return await this.authServiceClient.clientLogin(input)
  }

  @Mutation(() => Client, { nullable: true })
  async addNotificationIdClient (@Arg('input', () => SetNotificationIdInput) input: SetNotificationIdInput): Promise<Client | null> {
    return await this.clientService.addNotificationIdClient(input)
  }

  @Mutation(() => Boolean)
  async sendNotificationToClient (@Arg('input', () => AddNotificationInput) input: AddNotificationInput): Promise<Boolean> {
    return await this.clientService.sendNotificationToClient(input)
  }

  @Mutation(() => Client)
  @Authorized()
  async addClient (@Arg('input', () => AddClientInput) input: AddClientInput): Promise<Client> {
    return await this.clientService.addClient(input)
  }

  @Mutation(() => Client, { nullable: true })
  @Authorized()
  async updateClient (@Arg('input', () => UpdateClientInput) input: UpdateClientInput): Promise<Client | null> {
    return await this.clientService.updateClient(input)
  }

  @Mutation(() => Client, { nullable: true })
  @Authorized()
  async addNetwork (@Arg('input', () => NetworkInput) input: NetworkInput): Promise<Client | null> {
    return await this.clientService.addNetwork(input)
  }

  @Mutation(() => Client, { nullable: true })
  @Authorized()
  async udpateNetwork (@Arg('input', () => NetworkInput) input: NetworkInput): Promise<Client | null> {
    return await this.clientService.updateNetwork(input)
  }

  @Query(() => [History])
  @Authorized()
  async dataHistories (@Arg('input', () => HistoryInput) input: HistoryInput): Promise<History[]> {
    const follwers = await this.clientService.getDataHistories({ id: input.id, name: input.name, type: 'followersHistory', date: input.date })
    const likes = await this.clientService.getDataHistories({ id: input.id, name: input.name, type: 'likesHistory', date: input.date })
    const comments = await this.clientService.getDataHistories({ id: input.id, name: input.name, type: 'commentsHistory', date: input.date })
    const reached = await this.clientService.getDataHistories({ id: input.id, name: input.name, type: 'reachedHistory', date: input.date })
    const posts = await this.clientService.getDataHistories({ id: input.id, name: input.name, type: 'postsHistory', date: input.date })
    const profileViews = await this.clientService.getDataHistories({ id: input.id, name: input.name, type: 'profileViewsHistory', date: input.date })

    return [
      {
        networkType: 'followers',
        week: follwers.week,
        year: follwers.year
      },
      {
        networkType: 'likes',
        week: likes.week,
        year: likes.year
      },
      {
        networkType: 'comments',
        week: comments.week,
        year: comments.year
      },
      {
        networkType: 'reached',
        week: reached.week,
        year: reached.year
      }, {
        networkType: 'posts',
        week: posts.week,
        year: posts.year
      }, {
        networkType: 'profileViews',
        week: profileViews.week,
        year: profileViews.year
      }
    ]
  }

  @Query(() => [Client])
  @Authorized()
  async clientByName (@Arg('name', () => String) name: string, @Ctx() context: Context): Promise<Client[]> {
    if (context.user) {
      return await this.clientService.getClientsByName(name, context.user)
    }
    return []
  }
}
