import request from 'superagent';
import { handleSuccess, handleError } from '../utils/api';

export const putUser = info =>
  request.put('/api/user').send(info).then(handleSuccess).catch(handleError);

export const putUserPassword = passwordInfo =>
  request
    .put('/api/user/password')
    .send(passwordInfo)
    .then(handleSuccess)
    .catch(handleError);
