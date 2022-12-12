import { Request, Response } from 'express'
import { bucket, STORAGE_BUCKET } from '../libs/firabase'
import { v4 } from 'uuid'

class FilesController {
  async uploadFile (req: Request, res: Response): Promise<Response | undefined> {
    const file = req.file

    if (file === undefined) {
      return res.json('Arquivo não enviado!')
    }

    const fileNameModified = file.originalname.split(' ').join('_')

    const filename = `${fileNameModified.split('.')[0]}-${Date.now()}.${file.mimetype.split('/')[1]}`

    let folder = 'others'

    if (file.mimetype.split('/')[0] === 'image') {
      folder = 'images'
    }

    if (file.mimetype.split('/')[0] === 'video') {
      folder = 'videos'
    }

    const fileBucket = bucket.file(`${folder}/${filename}`)
    const token = v4()

    const stream = fileBucket.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        firebaseStorageDownloadTokens: token
      }
    })

    stream.on('error', err => {
      res.json(err)
    })

    stream.on('finish', () => {
      const uri = `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${folder}%2F${filename}?alt=media&token=${token}`
      res.json({ uri, folder, filename })
    })

    stream.end(file.buffer)
  }

  async deleteImage (req: Request<{}, {}, { filename: string, folder: string }>, res: Response): Promise<Response> {
    const { filename, folder } = req.body

    console.log({ filename, folder })

    const fileBucket = await bucket.file(`${folder}/${filename}`).delete()

    if (fileBucket) {
      return res.json(true)
    }

    return res.json(false)
  }
}

export default new FilesController()
