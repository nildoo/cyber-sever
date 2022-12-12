import { sign, verify, SignOptions } from 'jsonwebtoken'

const publicKey = Buffer.from(process.env.PUBLIC_KEY_TOKEN, 'base64').toString('ascii')

const privateKey = Buffer.from(process.env.PRIVATE_KEY_TOKEN, 'base64').toString('ascii')

export function signJwt (object: Object, options?: SignOptions | undefined): string {
  return sign(object, privateKey, {
    ...((options != null) && options),
    algorithm: 'RS256'
  })
}

export function verifyJwt<T> (token: string): T | null {
  try {
    const decoded = verify(token, publicKey) as T
    return decoded
  } catch (error) {
    return null
  }
}
