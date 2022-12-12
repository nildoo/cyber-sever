declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'dev' | 'prod'
      DATABASE_URL: string
      REDIS_URL_DEV: string
      ONESIGNAL_KEY_ONE: string
      ONESIGNAL_KEY_TWO: string
      PUBLIC_KEY_TOKEN: string
      PRIVATE_KEY_TOKEN: string
      SESSION_SECRET: string
      TYPE: string
      PROJECT_ID: string
      PRIVATE_KEY_ID: string
      PRIVATE_KEY: string
      CLIENT_EMAIL: string
      CLIENT_ID: string
      AUTH_URI: string
      TOKEN_URI: string
      AUTH_PROVIDER_X509_CERT_URL: string
      CLIENT_X509_CERT_URL: string
      STORAGE_BUCKET: string
    }
  }
}

export {}
