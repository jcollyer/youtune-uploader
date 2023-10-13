import request from 'superagent';
import { handleSuccess, handleError } from '../utils/api';

export const postTodo = (info:any) =>
  request.post('/api/todos')
    .send(info)
    .then(handleSuccess)
    .catch(handleError);

export const getTodos = () =>
  request.get('/api/todos')
    .then(handleSuccess)
    .catch(handleError);

export const putToggleCompleteTodo = (info:any) =>
  request.put('/api/todos/complete')
    .send(info)
    .then(handleSuccess)
    .catch(handleError);

export const putTodo = (info:any) =>
  request.put('/api/todos')
    .send(info)
    .then(handleSuccess)
    .catch(handleError);

export const deleteTodo = (info:any) =>
  request.delete('/api/todos')
    .send(info)
    .then(handleSuccess)
    .catch(handleError);
