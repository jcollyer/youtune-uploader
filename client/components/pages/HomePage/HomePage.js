import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import axios from 'axios';
import * as R from 'ramda';

import styles from './styles.module.css';

export default function HomePage() {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));

  useEffect(() => {
    if (R.isEmpty(user)) {
      dispatch(push('/login'));
    }
  }, [dispatch, user]);

  const onSubmit = event => {
    event.preventDefault();

    axios.post('http://localhost:3000/connectYT').then(response => {
      console.log('axios->', response.data);
    });
  };

  return (
    <div className={styles.root}>
      <div className="flex flex-col max-w-xl m-auto">
        <form action="connectYT" method="post">
          <h3 className="text-center mt-20 text-3xl mb-12">
            Connect your YouTube account to get started!
          </h3>
          <button
            type="submit"
            onClick={onSubmit}
            className="bg-orange-500 rounded font-bold text-white mx-auto p-4"
          >
            CONNECT
          </button>
        </form>
      </div>
    </div>
  );
}
