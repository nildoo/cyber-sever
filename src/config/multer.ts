import multer, { memoryStorage } from 'multer'

export const multerConfig = multer({
  storage: memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 16
  },
  fileFilter (req, file, callback) {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/pjpeg',
      'video/mp4'
    ]
    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true)
    } else {
      callback(new Error('Invalid filetype'))
    }
  }
})
