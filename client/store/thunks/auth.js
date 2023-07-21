import { snakeToCamelCase } from 'json-style-converter/es5';
import { Store as RNC } from 'react-notifications-component';
import { push } from 'redux-first-history';

import { cookieSet, login, logout } from '../actions/user';
import { dispatchError } from '../../utils/api';
import {
  connectYouTube,
  getPlaylist,
  setCookie,
  postRegister,
  postLogin,
  postLogout,
} from '../../services/auth';

export const attemptLogin = user => dispatch =>
  postLogin(user)
    .then(data => {
      dispatch(login(snakeToCamelCase(data.user)));

      RNC.addNotification({
        title: 'Success!',
        message: data.message,
        type: 'success',
        container: 'top-right',
        animationIn: ['animated', 'fadeInRight'],
        animationOut: ['animated', 'fadeOutRight'],
        dismiss: {
          duration: 5000,
        },
      });

      dispatch(push('/home'));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptRegister = newUser => dispatch =>
  postRegister(newUser)
    .then(data => {
      RNC.addNotification({
        title: 'Success!',
        message: data.message,
        type: 'success',
        container: 'top-right',
        animationIn: ['animated', 'fadeInRight'],
        animationOut: ['animated', 'fadeOutRight'],
        dismiss: {
          duration: 5000,
        },
      });

      return dispatch(attemptLogin(newUser));
    })
    .then(() => dispatch(push('/settings')))
    .catch(dispatchError(dispatch));

export const attemptLogout = () => dispatch =>
  postLogout()
    .then(data => {
      dispatch(logout());

      RNC.addNotification({
        title: 'Success!',
        message: data.message,
        type: 'success',
        container: 'top-right',
        animationIn: ['animated', 'fadeInRight'],
        animationOut: ['animated', 'fadeOutRight'],
        dismiss: {
          duration: 5000,
        },
      });

      dispatch(push('/login'));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptCookie = cookie => dispatch =>
  setCookie(cookie)
    .then(data => {
      dispatch(cookieSet(cookie));

      RNC.addNotification({
        title: 'Success!',
        message: data.message,
        type: 'success',
        container: 'top-right',
        animationIn: ['animated', 'fadeInRight'],
        animationOut: ['animated', 'fadeOutRight'],
        dismiss: {
          duration: 5000,
        },
      });

      dispatch(push('/home'));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptConnectYT = () => dispatch =>
  connectYouTube()
    .then(data => {
      console.log('----------data-->', data);
    })
    .catch(dispatchError(dispatch));

export const attemptGetPlaylist = () => dispatch =>
  getPlaylist()
    .then(data => {
      console.log('----------data-->', data);
    })
    .catch(dispatchError(dispatch));
