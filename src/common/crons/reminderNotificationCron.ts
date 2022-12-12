/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { CronJob } from 'cron'
import { ClientModel } from '../../entities/Client'
import { sendToUser } from '../../libs/OneSignal'

const reminderNotification = async () => {
  const clients = await ClientModel.find().lean()
  clients.forEach(async (item) => {
    if (!item.notificationId) {
      return
    }
    const id = item._id as string
    await sendToUser({
      title: 'Lembrete',
      user: id,
      message: 'Lembre-se sempre de acessar o aplicativo para acompanhar as novidades de suas redes sociais.'
    })
  })
}

const reminderNotificationCron = () => {
  const job = new CronJob(
    '0 9,17 * * *',
    // "* * * * *",
    reminderNotification,
    null,
    true,
    'America/Sao_Paulo'
  )
  job.start()
}

export default reminderNotificationCron
