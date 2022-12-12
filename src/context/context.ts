import { Request, Response } from 'express'
import { UserContext } from '../entities/Auth'

interface Context {
  req: Request
  res: Response
  user: UserContext | null
}

export default Context
