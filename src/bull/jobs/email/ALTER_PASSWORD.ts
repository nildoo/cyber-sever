
import BULL_JOBS from '../keys/BULL_JOBS'

// const adminEmail = process.env.EMAIL as string

interface IEmail {
  data: {
    email: string
    code: string
  }
}

export default {
  key: BULL_JOBS.ALTER_PASSWORD,
  options: {},
  async handle ({ data }: IEmail) {
    // const { email, code } = data

    // await nodemailer.sendMail({
    //   subject: 'Código para ativação de conta.',
    //   from: `Pet Salva < ${adminEmail} >`,
    //   to: email,
    //   html: `
    //   <div>
    //   <center>
    //   <h2>Seu códico de ativação é:</h2>
    //   <h1>${code}</h1>
    //   <h5>Expira em 10 minutos.</h5>
    //   </center>
    //   </div>`
    // })
  }
}
