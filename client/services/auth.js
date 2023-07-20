import request from 'superagent';
import { handleSuccess, handleError } from '../utils/api';

export const postRegister = user =>
  request
    .post('/api/auth/register')
    .send(user)
    .then(handleSuccess)
    .catch(handleError);

export const postLogin = user =>
  request
    .post('/api/auth/login')
    .send(user)
    .then(handleSuccess)
    .catch(handleError);

export const postLogout = () =>
  request.post('/api/auth/logout').then(handleSuccess).catch(handleError);

export const setCookie = cookie =>
  request
    .post('/api/auth/someCookie')
    .send(cookie)
    .then(handleSuccess)
    .catch(handleError);

export const connectYouTube = () =>
  request
    .post('/api/auth/connectYouTube')
    .then((data) => {
      console.log('--------data from connectYouTube', data.text);
      window.open(data.text, 'oauth window', 'width=500,height=500');
      // window.location.href = data.text;
    })
    .catch(handleError);
