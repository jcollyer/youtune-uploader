import { push } from 'redux-first-history';
import { Store as RNC } from 'react-notifications-component';

import { logout } from '../store/actions/user';

export const handleSuccess = (resp:any) => resp.body;

export const handleError = (error:any) => {
  if (error.response) {
    throw error.response;
  } else {
    const response = { status: 500, body: { message: 'Internal Server error' } };
    throw response;
  }
};

export const dispatchError = (dispatch:any) => (res:any) => {
  if (res.status === 401) {
    dispatch(logout());
    dispatch(push('/login'));
  }

  RNC.addNotification({
    title: `Error: ${res.status}`,
    message: res.body.message,
    type: 'danger',
    container: 'top-right',
    animationIn: ['animated', 'fadeInRight'],
    animationOut: ['animated', 'fadeOutRight'],
    dismiss: {
      duration: 5000,
    },
  });

  throw res;
};
