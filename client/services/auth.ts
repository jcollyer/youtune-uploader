import request from 'superagent';
import { handleSuccess, handleError } from '../utils/api';

import type { UserAuth } from '../types/user';

export const postRegister = (user:UserAuth) =>
  request
    .post('/api/auth/register')
    .send(user)
    .then(handleSuccess)
    .catch(handleError);

export const postLogin = (user:UserAuth) =>
  request
    .post('/api/auth/login')
    .send(user)
    .then(handleSuccess)
    .catch(handleError);

export const postLogout = () =>
  request.post('/api/auth/logout').then(handleSuccess).catch(handleError);

export const getPlaylist = () =>
  request
    .post('/api/auth/getPlaylist')
    .then(handleSuccess)
    .catch(handleError);
