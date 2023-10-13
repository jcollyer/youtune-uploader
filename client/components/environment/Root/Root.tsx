import React from 'react';
import { Provider } from 'react-redux';
import { HistoryRouter as Router } from 'redux-first-history/rr6';
import type { AppHistory, RootStore } from '../../../store';
import Main from '../Main';

export default function Root({ history, store }: { history: AppHistory, store:RootStore }) {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Main />
      </Router>
    </Provider>
  );
}
