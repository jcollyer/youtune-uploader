import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import axios from 'axios';
import * as R from 'ramda';
import Cookies from 'js-cookie';
import Calendar from '../../organisms/Calendar/Calendar';

import styles from './styles.module.css';

export default function HomePage() {
  Cookies.set('userPlaylistId', '');
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));
  const [authToken, setAuthToken] = useState(Cookies.get('userPlaylistId'));
  const [calendar, setCalendar] = useState([]);

  if (authToken) {
    console.log('authToken->', authToken);
    // const formData = new FormData();
    // formData.append('playlistId', authToken);
    axios
      .post('http://localhost:3000/getUnlisted', { playlistId: authToken })
      .then(response => {
        console.log('axios->', response.data);
        setCalendar(response.data);
      });
  }

  useEffect(() => {
    if (R.isEmpty(user)) {
      dispatch(push('/login'));
    }
  }, [dispatch, user]);

  // Update token with every render when its value has changed.
  const userPlaylistIdCookie = Cookies.get('userPlaylistId');
  if (authToken !== userPlaylistIdCookie) {
    setAuthToken(userPlaylistIdCookie);
  }
  const listenCookieChange = (callback, interval = 1000) => {
    let lastCookie = Cookies.get('userPlaylistId');
    setInterval(() => {
      const userPlaylistIdCookie = Cookies.get('userPlaylistId');

      if (userPlaylistIdCookie !== lastCookie) {
        try {
          callback({ oldValue: lastCookie, newValue: userPlaylistIdCookie });
        } finally {
          lastCookie = userPlaylistIdCookie;
        }
      }
    }, interval);
  };

  const onSubmit = event => {
    event.preventDefault();

    listenCookieChange(({ oldValue, newValue }) => {
      console.log(`Cookie changed from "${oldValue}" to "${newValue}"`);
      if (oldValue !== newValue) {
        setAuthToken(newValue);
      }
    }, 1000);

    axios.post('http://localhost:3000/connectYT').then(response => {
      console.log('axios->', response.data);
      window.open(
        response.data,
        'oauth window',
        'width=672,height=660,modal=yes,alwaysRaised=yes',
      );
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
      {authToken && <p>authenticated!</p>}
      {calendar?.map(video => (
        <div key={video.id}>
          <p>{new Date(video.status.publishAt).toDateString()}</p>
          <img
            src={video.snippet.thumbnails.default.url}
            alt="youtube thumbnail"
          />
        </div>
      ))}
      <Calendar />
    </div>
  );
}
