import request from 'superagent';
import { handleSuccess, handleError } from '../utils/api';

export const getUser = () =>
  request.get('/api/user').then(handleSuccess).catch(handleError);
