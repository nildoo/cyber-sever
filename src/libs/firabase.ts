import admin from 'firebase-admin'
import { getStorage } from 'firebase-admin/storage'

const serviceAccount = {
  type: process.env.TYPE,
  projectId: process.env.PROJECT_ID,
  privateKeyId: process.env.PRIVATE_KEY_ID,
  privateKey: process.env.PRIVATE_KEY.replace(/\\n/gm, '\n'),
  clientEmail: process.env.CLIENT_EMAIL,
  clientId: process.env.CLIENT_ID,
  authUri: process.env.AUTH_URI,
  tokenUri: process.env.TOKEN_URI,
  authProviderX509CertUrl: process.env.AUTH_PROVIDER_X509_CERT_URL,
  clientX509CertUrl: process.env.CLIENT_X509_CERT_URL
}

export const STORAGE_BUCKET = process.env.STORAGE_BUCKET

export const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: STORAGE_BUCKET
})

export const bucket = getStorage(app).bucket()
