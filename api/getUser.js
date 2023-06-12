import request from 'superagent';
import { handleSuccess, handleError } from '../client/utils/api';

export default function getUser() {
  return request.get('/api/user').then(handleSuccess).catch(handleError);
}
