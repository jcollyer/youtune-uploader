import request from 'superagent';
import { handleSuccess, handleError } from '../client/utils/api';

export default function putUserPassword(passwordInfo) {
  return request
    .put('/api/user/password')
    .send(passwordInfo)
    .then(handleSuccess)
    .catch(handleError);
}
