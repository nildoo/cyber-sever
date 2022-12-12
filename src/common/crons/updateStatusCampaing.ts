/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { CronJob } from 'cron'
import dayjs from 'dayjs'
import { CampaingModel } from '../../entities/Campaing'

const updateStatusCampaing = async () => {
  const campaing = await CampaingModel.find().lean()

  campaing.forEach(async (item) => {
    if (item.status === 'Finalizado') {
      return
    }
    if (dayjs().isAfter(item.endDate)) {
      await CampaingModel.findOneAndUpdate({ _id: item._id }, { status: 'Finalizado' }, { new: true })
    }
  })
}

const updateStatusCampaingCron = () => {
  const job = new CronJob(
    '0 0 * * *',
    updateStatusCampaing,
    null,
    true,
    'America/Sao_Paulo'
  )
  job.start()
}

export default updateStatusCampaingCron
