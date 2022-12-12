import { UpdateClientInput } from './../entities/Client'
import { ApolloError } from 'apollo-server-express'
import { AddClientInput, NetworkInput, Client, ClientModel, HistoryInputService, SetNotificationIdInput } from '../entities/Client'
import dayjs from 'dayjs'
import weeday from 'dayjs/plugin/weekday'
import { AddNotificationInput } from '../entities/Notification'
import { sendToUser } from '../libs/OneSignal'
import { UserContext } from '../entities/Auth'
dayjs.extend(weeday)
export interface ClientContext {
  _id?: string
  email?: string
}

export class ClientService {
  async addClient (input: AddClientInput): Promise<Client> {
    try {
      const clientExists = await ClientModel.findOne({ email: input.email })

      if (clientExists) {
        throw new ApolloError('Email já cadastrado!')
      }

      const client = await (await ClientModel.create(input)).populate('consultant')

      return client
    } catch (error) {
      throw new ApolloError(String(error))
    }
  }

  async updateClient (input: UpdateClientInput): Promise<Client | null> {
    try {
      const client = await ClientModel.findOneAndUpdate({ _id: input.id }, input, { new: true }).populate('consultant')
      return client
    } catch (error) {
      throw new ApolloError('Erro ao criar cliente')
    }
  }

  async addNotificationIdClient (input: SetNotificationIdInput): Promise<Client | null> {
    try {
      const client = await ClientModel.findOneAndUpdate({ _id: input.client_id }, { notificationId: input.notificationId }, { new: true })
      return client
    } catch (error) {
      throw new ApolloError('Erro ao criar cliente')
    }
  }

  async sendNotificationToClient (input: AddNotificationInput): Promise<Boolean> {
    try {
      const user = input.client
      const notification = await sendToUser({
        title: input.title,
        message: input.message,
        user
      })
      return !!notification
    } catch (error) {
      throw new ApolloError('Erro ao enviar.')
    }
  }

  async getClientById (_id: string): Promise<Client | null> {
    try {
      const client = await ClientModel.findOne({ _id }).populate('consultant')
      return client
    } catch (error) {
      throw new ApolloError('Erro ao buscar cliente')
    }
  }

  async getClientByEmail (email: string): Promise<Client | null> {
    try {
      return await ClientModel.findOne({ email }).populate('consultant')
    } catch (error) {
      throw new ApolloError('Erro ao buscar clientes')
    }
  }

  async getClients (input: UserContext): Promise<Client[]> {
    try {
      if (input.role === 'consultant') {
        const clients = await ClientModel.find({ consultant: input._id }).populate('consultant')
        return clients
      } else {
        const clients = await ClientModel.find({}).populate('consultant')
        return clients
      }
    } catch (error) {
      throw new ApolloError('Erro ao buscar clientes')
    }
  }

  async getClientsByName (name: string, user: UserContext): Promise<Client[]> {
    try {
      if (user.role === 'consultant') {
        const clients = (await ClientModel.find({ consultant: user._id }).populate('consultant')).filter(n => n.name.toLowerCase().startsWith(name.toLowerCase()))
        return clients
      } else {
        const clients = (await ClientModel.find({}).populate('consultant')).filter(n => n.name.toLowerCase().startsWith(name.toLowerCase()))
        return clients
      }
    } catch (error) {
      throw new ApolloError('Erro ao buscar cliente')
    }
  }

  async getDataHistories (input: HistoryInputService): Promise<{ week: number[], year: number[] }> {
    try {
      const client = (await ClientModel.findById(input.id).populate('consultant'))?.toObject()

      const weekArray: number[] = [0, 0, 0, 0, 0, 0, 0]
      const yearArray: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

      if (client) {
        const networkData = client.networks.filter(c => c.name === input.name)[0]
        const week = Array.from(Array(7).keys()).map(d => input.date ? dayjs(input.date).weekday(d).format('DD') : dayjs().weekday(d).format('DD'))

        // eslint-disable-next-line array-callback-return
        const days = networkData.insights[input.type].map(d => {
          if (week.includes(dayjs(d.date).format('DD'))) {
            const dayr = dayjs(d.date).format('DD')
            const qtd = d.quantity
            const index = week.findIndex((e) => e === dayr)
            return { dayr, index, qtd }
          }
        })

        // eslint-disable-next-line array-callback-return
        networkData.insights[input.type].map(d => {
          if (dayjs(d.date).year() === dayjs(input.date).year()) {
            yearArray[dayjs(d.date).month()] = d.quantity
          }
        })

        // eslint-disable-next-line array-callback-return
        Array.from(Array(7).keys()).map((c) => {
          const day = days.filter(d => d?.index === c)[0]
          if (day) {
            weekArray[day.index] = day.qtd
          }
        })
      }
      return {
        week: weekArray,
        year: yearArray
      }
    } catch (error) {
      throw new ApolloError('Erro ao buscar dados')
    }
  }

  async addNetwork (input: NetworkInput): Promise<Client | null> {
    try {
      const dateNow = dayjs().format('YYYY-MM-DD')
      const clients = await ClientModel.findOneAndUpdate({ _id: input.id }, {
        $push: {
          networks: {
            name: input.name,
            lastUpdate: dateNow,
            insights: {
              followers: input.followers,
              profileViews: input.profileViews,
              posts: input.posts,
              likes: input.likes,
              comments: input.comments,
              reached: input.reached,
              followersHistory: [{ date: dateNow, quantity: input.followers }],
              likesHistory: { date: dateNow, quantity: input.likes },
              commentsHistory: { date: dateNow, quantity: input.comments },
              reachedHistory: { date: dateNow, quantity: input.reached },
              postsHistory: { date: dateNow, quantity: input.posts },
              profileViewsHistory: { date: dateNow, quantity: input.profileViews }
            }
          }
        }
      }, { new: true }).populate('consultant')
      return clients
    } catch (error) {
      throw new ApolloError('Erro cadastrar rede social')
    }
  }

  async updateNetwork (input: NetworkInput): Promise<Client | null> {
    try {
      const client = await ClientModel.findById(input.id).populate('consultant') as Client

      const networkResult = client.networks?.filter(c => c.name === input.name)[0]

      if (dayjs().day() === dayjs(networkResult.lastUpdate).day()) {
        throw new ApolloError('Relatório já adicionado hoje!')
      }

      const index = client.networks.findIndex(n => n.name === input.name)

      if (index > -1) {
        const dateNow = new Date(Date.now())

        const followers = networkResult.insights.followersHistory
        followers.push({ date: dateNow, quantity: input.followers })

        const likes = networkResult.insights.likesHistory
        likes.push({ date: dateNow, quantity: input.likes })

        const comments = networkResult.insights.commentsHistory
        comments.push({ date: dateNow, quantity: input.comments })

        const reached = networkResult.insights.reachedHistory
        reached.push({ date: dateNow, quantity: input.reached })

        const posts = networkResult.insights.postsHistory
        posts.push({ date: dateNow, quantity: input.posts })

        const profileViews = networkResult.insights.profileViewsHistory
        profileViews.push({ date: dateNow, quantity: input.profileViews })

        client.networks[index].lastUpdate = dateNow
        client.networks[index].insights.followers = input.followers
        client.networks[index].insights.likes = input.likes
        client.networks[index].insights.comments = input.comments
        client.networks[index].insights.reached = input.reached
        client.networks[index].insights.posts = input.posts
        client.networks[index].insights.profileViews = input.profileViews

        client.networks[index].insights.followersHistory = followers
        client.networks[index].insights.likesHistory = likes
        client.networks[index].insights.commentsHistory = comments
        client.networks[index].insights.reachedHistory = reached
        client.networks[index].insights.postsHistory = posts
        client.networks[index].insights.profileViewsHistory = profileViews
      }

      const clients = await ClientModel.findOneAndUpdate({ _id: input.id }, client, { new: true })

      return clients
    } catch (error) {
      throw new ApolloError(String(error))
    }
  }

  async getTotalClients (input: UserContext): Promise<number> {
    try {
      if (input.role === 'consultant') {
        const totalClients = await ClientModel.countDocuments({ consultant: input._id })
        return totalClients
      } else {
        const totalClients = await ClientModel.countDocuments({})
        return totalClients
      }
    } catch (error) {
      throw new ApolloError('Erro ao buscar clientes')
    }
  }
}
