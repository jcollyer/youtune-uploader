import React from 'react';
import { render } from 'react-dom';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.compat.css';

import Root from './components/environment/Root';
import { store, history } from './store';

render(
  <Root history={history} store={store} />,
  document.getElementById('app'),
);
