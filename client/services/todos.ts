import request from 'superagent';
import { handleSuccess, handleError } from '../utils/api';

export const postTodo = (info:{text: string}) =>
  request.post('/api/todos')
    .send(info)
    .then(handleSuccess)
    .catch(handleError);

export const getTodos = () =>
  request.get('/api/todos')
    .then(handleSuccess)
    .catch(handleError);

export const putToggleCompleteTodo = (info:{text: string}) =>
  request.put('/api/todos/complete')
    .send(info)
    .then(handleSuccess)
    .catch(handleError);

export const putTodo = (info:{text: string}) =>
  request.put('/api/todos')
    .send(info)
    .then(handleSuccess)
    .catch(handleError);

export const deleteTodo = (info:{text: string}) =>
  request.delete('/api/todos')
    .send(info)
    .then(handleSuccess)
    .catch(handleError);
