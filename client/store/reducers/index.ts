import { combineReducers } from 'redux';

import user from './user';
import todos from './todos';

const createRootReducer = (routerReducer:any) => combineReducers({
  router: routerReducer,
  user,
  todos,
});

export default createRootReducer;
