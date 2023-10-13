export interface Todo {
  id: number;
  text?: string;
  createdAt?: string;
  updatedAt?: string;
  completed?: boolean;
}

export interface Todos {
  todos: Todo[];
}
