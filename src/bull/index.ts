import Queue from 'bull'
import jobs from './jobs'
import 'dotenv/config'

const REDIS = process.env.NODE_ENV === 'dev' ? process.env.REDIS_URL_DEV : 'red_prod_url_here'

const queues = Object.values(jobs).map(job => ({
  bull: new Queue(job.key, REDIS),
  name: job.key,
  handle: job.handle
}))

export default {
  queues,
  add (name: keyof typeof jobs, data: any) {
    const queue: any = this.queues.find(queue => queue.name === name)
    queue.bull.add(data)
  },
  async process () {
    console.log('🟢 Worker is run')
    return this.queues.forEach(queue => {
      queue.bull.process(queue.handle).catch((err) => {
        console.log(err)
        console.log('aqui')
      })

      queue.bull.on('failed', (job, err) => {
        console.log('Job failed', queue.name, job.data)
        console.log('Job error', err)
      })
    })
  }
}
