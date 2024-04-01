import { Types } from 'mongoose';
import Session from '../models/user/session';
import { privateField } from '../models/user/rider';
import { signJwt } from './token';
import { omit } from 'lodash'

const createSession = async function ({ userId }: { userId: Types.ObjectId }) {
  return await Session.create({ userId });
};

export async function signRefreshToken({ userId }: { userId: Types.ObjectId }) {
  const session = await createSession({ userId });

  const payload = { session: (await session)._id };
  const refreshToken = await signJwt(payload, {
    expiresIn: '1y'
  });

  return refreshToken;
}

export async function signAccessToken(user: any) {
  const payload = omit(user.toJSON(), privateField);

  const accessToken = await signJwt(payload, {
    expiresIn: '1d',
  });

  return accessToken;
}

export async function findSessionById(id: string) {
  return Session.findById(id);
}
