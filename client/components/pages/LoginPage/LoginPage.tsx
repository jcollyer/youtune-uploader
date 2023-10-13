import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import * as R from 'ramda';
import { Link } from 'react-router-dom';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';

import Control from 'react-bulma-companion/lib/Control';
import Checkbox from 'react-bulma-companion/lib/Checkbox';

import useKeyPress from '../../../hooks/useKeyPress';
import { attemptLogin } from '../../../store/thunks/auth';
import FormInput from '../../molecules/FormInput';

import type { RootState } from '../../../store';

export default function LoginPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((store:RootState) => store.user);

  useEffect(() => {
    if (user) {
      dispatch(push('/home'));
    }
  }, [dispatch, user]);

  const [remember, setRemember] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      setRemember(true);
      setUsername(username);
    }
  }, []);

  const login = () => {
    const userCredentials = { username, password };

    if (remember) {
      localStorage.setItem('username', username);
    }

    dispatch(attemptLogin(userCredentials)).catch(R.identity);
  };

  useKeyPress('Enter', login);

  const rememberMe = () => {
    localStorage.removeItem('username');
    setRemember(!remember);
  };

  const updateUsername = (e:React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);
  const updatePassword = (e:React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  return (
    <section className="pt-64">
      <div className="bg-white w-96 mx-auto py-8 px-12 rounded-xl">
        <h3 className="mb-8 text-5xl">Login</h3>
        <p>
          Not Registered Yet?&nbsp;
          <Link to="/register">Create an account.</Link>
        </p>
        <br />
        <FormInput
          onChange={updateUsername}
          placeholder="Username"
          value={username}
          leftIcon={faUser}
          className="h-8"
        />
        <FormInput
          onChange={updatePassword}
          placeholder="Password"
          value={password}
          leftIcon={faLock}
          type="password"
        />
        <p>
          <Link to="/recovery">Forgot your password?</Link>
        </p>
        <br />
        <Control className="is-clearfix">
          <button
            className="font-bold py-2 px-4 rounded border border-slate-400 hover:border-slate-500"
            type="button"
            onClick={login}
          >
            Login
          </button>
          <br />
          <br />
          <Checkbox>
            <input type="checkbox" onChange={rememberMe} checked={remember} />
            <span>&nbsp; Remember me</span>
          </Checkbox>
        </Control>
      </div>
    </section>
  );
}
