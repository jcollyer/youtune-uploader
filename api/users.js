import request from 'superagent';
import { handleSuccess, handleError } from '../client/utils/api';

export const postCheckUsername = username =>
  request.post('/api/users/checkusername')
    .send({ username })
    .then(handleSuccess)
    .catch(handleError);
