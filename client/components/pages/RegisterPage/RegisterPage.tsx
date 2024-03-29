import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'redux-first-history';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons/faTriangleExclamation';

import Field from 'react-bulma-companion/lib/Field';
import Control from 'react-bulma-companion/lib/Control';
import Icon from 'react-bulma-companion/lib/Icon';
import Input from 'react-bulma-companion/lib/Input';
import Label from 'react-bulma-companion/lib/Label';
import Help from 'react-bulma-companion/lib/Help';
import * as R from 'ramda';

import useKeyPress from '../../../hooks/useKeyPress';
import { attemptRegister } from '../../../store/thunks/auth';
import { validateUsername, validatePassword } from '../../../utils/validation';
import { postCheckUsername } from '../../../services/users';

import type { User } from '../../../types/user';
import type { RootState } from '../../../store';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const { user }:User = useSelector((store:RootState) => store.user);

  useEffect(() => {
    if (user) {
      dispatch(push('/home'));
    }
  }, [dispatch, user]);

  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [password, setPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const checkPassword = (newUsername:string, newPassword:string) => {
    const { valid, message } = validatePassword(newUsername, newPassword);

    setPasswordValid(valid);
    setPasswordMessage(message);
  };

  const checkUsername = (newUsername:string) => {
    const { valid, message } = validateUsername(newUsername);

    if (valid) {
      setUsernameMessage('Checking username...');
      setUsernameAvailable(false);

      postCheckUsername(newUsername)
        .then(res => {
          setUsernameAvailable(res.available);
          setUsernameMessage(res.message);
        })
        .catch(R.identity);
    } else {
      setUsernameAvailable(valid);
      setUsernameMessage(message);
    }
  };

  const updateUsername = (newUserName:string) => {
    setUsername(newUserName);
    checkPassword(newUserName, password);
  };

  const handleUsernameChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    updateUsername(e.target.value);
    checkUsername(e.target.value);
  };

  const handlePasswordChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    checkPassword(username, e.target.value);
  };

  const register = () => {
    if (usernameAvailable && passwordValid) {
      const newUser = {
        username,
        password,
      };

      dispatch(attemptRegister(newUser)).catch(R.identity);
    }
  };

  useKeyPress('Enter', register);

  return (
    <section className="pt-64">
      <div className="bg-white w-96 mx-auto py-8 px-12 rounded-xl">
        <h3 className="mb-8 text-5xl">Sign Up</h3>
        <p>
          Already a member?&nbsp;
          <Link to="/login">Login</Link>
        </p>
        <br />
        <Field>
          <Label htmlFor="username">Username</Label>
          <Control iconsRight>
            <Input
              id="username"
              placeholder="Username"
              color={
                username ? (usernameAvailable ? 'success' : 'danger') : undefined
              }
              value={username}
              onChange={handleUsernameChange}
            />
            {username && (
              <Icon
                size="small"
                align="right"
                color={usernameAvailable ? 'success' : 'danger'}
              >
                <FontAwesomeIcon
                  icon={usernameAvailable ? faCheck : faTriangleExclamation}
                />
              </Icon>
            )}
          </Control>
          {username && (
            <Help color={usernameAvailable ? 'success' : 'danger'}>
              {usernameMessage}
            </Help>
          )}
        </Field>
        <Field>
          <Label htmlFor="password">Password</Label>
          <Control iconsRight>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              color={
                password ? (passwordValid ? 'success' : 'danger') : undefined
              }
              value={password}
              onChange={handlePasswordChange}
            />
            {password && (
              <Icon
                size="small"
                align="right"
                color={passwordValid ? 'success' : 'danger'}
              >
                <FontAwesomeIcon
                  icon={passwordValid ? faCheck : faTriangleExclamation}
                />
              </Icon>
            )}
          </Control>
          {password && (
            <Help color={passwordValid ? 'success' : 'danger'}>
              {passwordMessage}
            </Help>
          )}
        </Field>
        <br />
        <div className="has-text-right">
          <button
            className="font-bold py-2 px-4 rounded border border-slate-400 hover:border-slate-500"
            onClick={register}
            disabled={!passwordValid || !usernameAvailable}
            type="button"
          >
            Create Account
          </button>
        </div>
      </div>
    </section>
  );
}
