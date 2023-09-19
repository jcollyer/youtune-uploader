import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import * as R from 'ramda';

export default function WelcomePage() {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));

  useEffect(() => {
    if (!R.isEmpty(user)) {
      dispatch(push('/home'));
    }
  }, [dispatch, user]);

  return (
    <div className="flex flex-col">
      <h1 className="text-8xl text-center pt-40 text-white">
        Carrot Cake
      </h1>
      <div
        className="m-auto"
        style={{
          background: 'url(/images/icon.png)',
          width: '550px',
          height: '350px',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        &nbsp;
      </div>
      <h3 className="text-center mt-20 text-3xl">SET IT + FORGET IT</h3>
      <p className="text-center text-2xl mt-4">
        Easily Upload and Schedule
        <b> YouTube </b>
        Videos to your channel.
      </p>
    </div>
  );
}
