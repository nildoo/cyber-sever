import 'dotenv/config'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { ApolloServer } from 'apollo-server-express'
import { resolvers } from './resolvers'
import { connectToMongo } from './database/mongo'
import { authentication } from './utils/authentication'
import Context from './context/context'
import authChecker from './context/auth'
import app from './libs/express'
import reminderNotificationCron from './common/crons/reminderNotificationCron'
import updateStatusCampaingCron from './common/crons/updateStatusCampaing'

declare module 'express-session' {
  export interface SessionData {
    userId: string | undefined
  }
}

void (async () => {
  const schema = await buildSchema({
    authChecker,
    resolvers
  })

  const apolloServer = new ApolloServer({
    schema,
    context: async (ctx: Context): Promise<Context> => {
      return await authentication(ctx)
    },
    csrfPrevention: true,
    formatError: (err) => {
      if (err.message.startsWith('Cast to ObjectId')) {
        return new Error('Id Inválido!')
      }
      return err
    },
    cache: 'bounded',
    introspection: process.env.ENVIROMENT !== 'PROD'
  })

  const PORT = process.env.PORT ?? 4000

  await apolloServer.start()
  apolloServer.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: ['https://cyberforbusiness.vercel.app', 'https://cyber-for-business-cyberforbusiness.vercel.app/', 'http://localhost:3000', '*', 'https://studio.apollographql.com']
    }
  })

  app.listen({ port: PORT }, () => {
    console.log(`Server is running in http://localhost:${PORT}/graphql`)
  })

  await connectToMongo()

  // Notificação de lembretes
  // Reminder notification
  reminderNotificationCron()
  // Atualizar status da campanha
  // Update campaign status
  updateStatusCampaingCron()
})()
