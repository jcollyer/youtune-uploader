import request from 'superagent';
import { handleSuccess, handleError } from '../client/utils/api';

export default function putUser(info) {
  return request.put('/api/user').send(info).then(handleSuccess).catch(handleError);
}
