import express, { Request, Response, NextFunction } from 'express'
import { authentication } from '../utils/authentication'
import { multerConfig } from '../config/multer'
import FilesController from '../Controllers/FilesController'
import cors, { CorsOptions } from 'cors'

export const app = express()

export const middlewareAuth = (req: Request, res: Response, next: NextFunction): any => {
  authentication({ req, res, user: null })
    .then((res) => next())
    .catch(() => next(res.status(403).json({ message: 'Not authorized!' })))
}

const corsOptions: CorsOptions = {
  credentials: true,
  origin: ['https://cyberforbusiness.vercel.app', 'https://cyber-for-business-cyberforbusiness.vercel.app/', 'http://localhost:3000', '*', 'https://studio.apollographql.com'],
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions))

app.post('/upload', multerConfig.single('file'), FilesController.uploadFile)
app.post('/delete', FilesController.deleteImage)

export default app
