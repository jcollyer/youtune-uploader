import type { User } from '../../types/user';

export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const UPDATE_USER = 'UPDATE_USER';

export function login(user:User) {
  console.log('user', user);
  return {
    type: LOGIN_USER,
    user,
  };
}

export function logout() {
  return {
    type: LOGOUT_USER,
  };
}

export function updateUser(user:User) {
  return {
    type: UPDATE_USER,
    user,
  };
}
