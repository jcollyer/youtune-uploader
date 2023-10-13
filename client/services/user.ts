import request from 'superagent';
import { handleSuccess, handleError } from '../utils/api';

export const putUser = (info:any) =>
  request.put('/api/user').send(info).then(handleSuccess).catch(handleError);

export const putUserPassword = (passwordInfo:{ oldPassword: string; newPassword: string; }) =>
  request
    .put('/api/user/password')
    .send(passwordInfo)
    .then(handleSuccess)
    .catch(handleError);
