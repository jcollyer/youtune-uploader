import React from 'react';
import { useSelector } from 'react-redux';
import * as R from 'ramda';

import Todo from '../../molecules/Todo';

export default function TodoList() {
  const { todos } = useSelector(R.pick(['todos']));

  return (
    <ul className="todo-list">
      {R.reverse(todos).map(todo => <Todo key={todo.id} {...todo} />)}
    </ul>
  );
}
