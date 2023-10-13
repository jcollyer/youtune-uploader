import { Todo } from '../../types/todo';

export const SET_TODOS = 'SET_TODOS';
export const ADD_TODO = 'ADD_TODO';
export const TOGGLE_COMPLETE_TODO = 'TOGGLE_COMPLETE_TODO';
export const UPDATE_TODO = 'UPDATE_TODO';
export const REMOVE_TODO = 'REMOVE_TODO';
export const INCREMENT_TODO_ID = 'INCREMENT_TODO_ID';

export const setTodos = (todos:Todo[]) => ({
  type: SET_TODOS,
  todos,
});

export const addTodo = ({ id, text, createdAt }:Todo) => ({
  type: ADD_TODO,
  createdAt,
  id,
  text,
});

export const toggleCompleteTodo = (id:number) => ({
  type: TOGGLE_COMPLETE_TODO,
  id,
});

export const updateTodo = ({ id, text, updatedAt }:Todo) => ({
  type: UPDATE_TODO,
  updatedAt,
  id,
  text,
});

export const removeTodo = (id:number) => ({
  type: REMOVE_TODO,
  id,
});
