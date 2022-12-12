import { ApolloError } from 'apollo-server-express'
import { ClientModel } from '../entities/Client'
import * as OneSignal from 'onesignal-node'

const ONESIGNAL_KEY_ONE = process.env.ONESIGNAL_KEY_ONE
const ONESIGNAL_KEY_TWO = process.env.ONESIGNAL_KEY_TWO

const client = new OneSignal.Client(ONESIGNAL_KEY_ONE, ONESIGNAL_KEY_TWO)

interface ISend {
  title: string
  message: string
}

// export const send = async ({ title, message }: ISend) => {
//   const notification = {
//     headings: {
//       pt: title,
//       en: title,
//     },
//     contents: {
//       pt: message,
//       en: message,
//     },
//     included_segments: ['Subscribed Users'],
//     // filters: [{ field: 'tag', key: 'level', relation: '>', value: 10 }],
//   }

//   try {
//     const response = await client.createNotification(notification)
//     return response.body
//   } catch (e: any) {
//     if (e instanceof OneSignal.HTTPError) {
//       console.log(e.statusCode)
//       console.log(e.body)
//     }
//     return null
//   }
// }

interface ISendToClient extends ISend {
  title: string
  message: string
  data?: any
  user: string
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const sendToUser = async ({
  title,
  message,
  data,
  user
}: ISendToClient) => {
  const currentUser = await ClientModel.findOne({ _id: user })

  if (!currentUser) {
    throw new ApolloError('Usuário não encontrado.')
  }

  const id = currentUser.notificationId as string

  if (!id) {
    return null
  }

  const notification = {
    headings: {
      pt: title,
      en: title
    },
    contents: {
      pt: message,
      en: message
    },
    include_player_ids: [id],
    data
    // filters: [{ field: 'tag', key: 'level', relation: '>', value: 10 }],
  }

  try {
    const response = await client.createNotification(notification)
    return response.body
  } catch (e: any) {
    throw new ApolloError('Erro ao enviar menssagens.')
  }
}

// interface ISendToUsers extends ISend {
//   users: any[]
//   data?: object
// }

// export const sendToUsers = async ({
//   title,
//   message,
//   users,
//   data,
// }: ISendToUsers) => {
//   const ids = users?.map((item: any) => item?.notificationId)

//   const notification = {
//     headings: {
//       pt: title,
//       en: title,
//     },
//     contents: {
//       pt: message,
//       en: message,
//     },
//     include_player_ids: ids,
//     data,
//     // filters: [{ field: 'tag', key: 'level', relation: '>', value: 10 }],
//   }

//   try {
//     users.forEach(async (item) => {
//       await Notification.create({
//         message,
//         title,
//         to: item?.user,
//         notificationId: item?.notificationId,
//       })

//       const user = (await User.findOne({ _id: item?.user })) as IUser

//       user.notificationCount = user.notificationCount + 1

//       await user.save()
//     })

//     const response = await client.createNotification(notification)

//     return response.body
//   } catch (e: any) {
//     if (e instanceof OneSignal.HTTPError) {
//       throw new UserInputError(e, {
//         invalidArgs: Object.keys(e),
//       })
//     }
//     return null
//   }
// }
