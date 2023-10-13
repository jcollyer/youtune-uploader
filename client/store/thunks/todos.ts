import { snakeToCamelCase } from 'json-style-converter/es5';
import * as R from 'ramda';
import { setTodos, addTodo, toggleCompleteTodo, updateTodo, removeTodo } from '../actions/todo';
import { dispatchError } from '../../utils/api';
import { getTodos, postTodo, putToggleCompleteTodo, putTodo, deleteTodo } from '../../services/todos';
import { AppDispatch } from '..';

export const attemptGetTodos = () => (dispatch:AppDispatch) =>
  getTodos()
    .then(data => {
      const todos = R.map(todo =>
        R.omit(['Id'], R.assoc('id', todo._id, snakeToCamelCase(todo))), data.todos);

      dispatch(setTodos(todos));
      return data.todos;
    })
    .catch(dispatchError(dispatch));

export const attemptAddTodo = (text:string) => (dispatch:AppDispatch) =>
  postTodo({ text })
    .then(data => {
      const todo = <any>R.omit(['Id'], R.assoc('id', data.todo._id, snakeToCamelCase(data.todo)));

      dispatch(addTodo(todo));
      return data.user;
    })
    .catch(dispatchError(dispatch));

export const attemptToggleCompleteTodo = (id:number) => (dispatch:AppDispatch) =>
  putToggleCompleteTodo({ id })
    .then(data => {
      dispatch(toggleCompleteTodo(id));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptUpdateTodo = (id:number, text:string) => (dispatch:AppDispatch) =>
  putTodo({ id, text })
    .then(data => {
      dispatch(updateTodo({ id, text, updatedAt: data.todo.updated_at }));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptDeleteTodo = (id:number) => (dispatch:AppDispatch) =>
  deleteTodo({ id })
    .then(data => {
      dispatch(removeTodo(id));
      return data;
    })
    .catch(dispatchError(dispatch));
