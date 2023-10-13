import { snakeToCamelCase } from 'json-style-converter/es5';
import { Store as RNC } from 'react-notifications-component';
import { updateUser } from '../actions/user';
import { dispatchError } from '../../utils/api';
import { putUser, putUserPassword } from '../../services/user';
import { getUser } from '../../services/getUser';
import { AppDispatch } from '..';

type passwordInfoProps = { oldPassword: string; newPassword: string; };

export const attemptGetUser = () => (dispatch: AppDispatch) =>
  getUser()
    .then(data => {
      dispatch(updateUser(snakeToCamelCase(data.user)));
      return data.user;
    })
    .catch(dispatchError(dispatch));

export const attemptUpdateUser = (updatedUser: any) => (dispatch: AppDispatch) =>
  putUser(updatedUser)
    .then(data => {
      dispatch(updateUser(snakeToCamelCase(data.user)));

      RNC.addNotification({
        title: 'Success!',
        message: data.message,
        type: 'success',
        insert: 'bottom',
        container: 'top-right',
        animationIn: ['animated', 'fadeInRight'],
        animationOut: ['animated', 'fadeOutRight'],
        dismiss: {
          duration: 5000,
        },
      });

      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptUpdatePassword = (passwordInfo:passwordInfoProps) => (dispatch: AppDispatch) =>
  putUserPassword(passwordInfo)
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

      return data;
    })
    .catch(dispatchError(dispatch));
