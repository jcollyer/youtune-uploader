import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { createBrowserHistory } from 'history';
import { createReduxHistoryContext } from 'redux-first-history';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import createRootReducer from './reducers';

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
  history: createBrowserHistory(),
});

const middlewares = [routerMiddleware, thunk];

if (process.env.NODE_ENV === 'development') {
  const logger = createLogger({ collapsed: true, diff: true });
  middlewares.push(logger);
}

export const store = createStore(
  createRootReducer(routerReducer),
  applyMiddleware(...middlewares),
);

export const history = createReduxHistory(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppHistory = typeof history;
