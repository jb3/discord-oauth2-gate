import jwt from 'jsonwebtoken';

export function sign(data: Record<string, any>) {
  return jwt.sign(data, SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: "1 week"
  })
}

export function verifyAndDecode(token: string) {
  return jwt.verify(token, SECRET_KEY)
}
