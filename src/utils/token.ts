import jwt from 'jsonwebtoken';

const jwt_token = process.env.JWT_TOKEN
export async function signJwt(object: object, options?: jwt.SignOptions): Promise<string> {
  return jwt.sign(object, jwt_token, {
    ...(options && options)
  });
}

export async function verifyJwt<T>(token: string): Promise<T>{
  try {
    const decoded = jwt.verify(token, jwt_token) as T;
    return decoded;
  } catch (e) {
    throw e;
  }
}
