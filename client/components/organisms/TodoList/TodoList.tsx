import React from 'react';
import { useSelector } from 'react-redux';
import * as R from 'ramda';

import Todo from '../../molecules/Todo';
import { RootState } from '../../../store';
import type { Todos } from '../../../types/todo';

export default function TodoList() {
  const { todos }:Todos = useSelector((store:RootState) => store.todos);

  return (
    <ul className="todo-list">
      {R.reverse(todos).map(todo => <Todo key={todo.id} {...todo} />)}
    </ul>
  );
}
