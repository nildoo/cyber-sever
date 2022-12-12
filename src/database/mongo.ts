import mongoose from 'mongoose'

const URI = process.env.DATABASE_URL

export async function connectToMongo (): Promise<void> {
  try {
    await mongoose.connect(URI)
    console.log('Connected to database!')
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
