import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import * as R from 'ramda';

import Section from 'react-bulma-companion/lib/Section';

import Login from '../../organisms/Login';

export default function LoginPage() {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));

  useEffect(() => {
    if (!R.isEmpty(user)) {
      dispatch(push('/home'));
    }
  }, [dispatch, user]);

  return (
    <Section>
      <Login />
    </Section>
  );
}
