import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import axios from 'axios';
import * as R from 'ramda';
import Cookies from 'js-cookie';
import Calendar from '../../organisms/Calendar/Calendar';
import { attemptCookie, attemptConnectYT } from '../../../store/thunks/auth';

export default function HomePage() {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));
  const [playlistToken, setPlaylistToken] = useState(
    Cookies.get('userPlaylistId'),
  );
  const [userTokens] = useState(Cookies.get('tokens'));
  const [scheduledVideos, setscheduledVideos] = useState([]);

  useEffect(() => {
    if (userTokens && playlistToken) {
      axios.post('http://localhost:3000/getPlaylistId', { tokens: userTokens });
    }
  }, [userTokens, playlistToken]);

  useEffect(() => {
    if (playlistToken) {
      axios
        .post('http://localhost:3000/getUnlisted', {
          playlistId: playlistToken,
        })
        .then(response => setscheduledVideos(response.data));
    }
  }, [playlistToken]);

  useEffect(() => {
    if (R.isEmpty(user)) {
      dispatch(push('/login'));
    }
  }, [dispatch, user]);

  const listenCookieChange = (callback, interval = 1000) => {
    let lastCookie = Cookies.get('userPlaylistId');
    setInterval(() => {
      const userPlaylistIdCookie = Cookies.get('userPlaylistId');
      const cookiename = Cookies.get('cookiename');
      const tokens = Cookies.get('tokens');
      console.log('--------------->>', { userPlaylistIdCookie, cookiename, tokens });
      if (userPlaylistIdCookie !== lastCookie) {
        try {
          callback({ oldValue: lastCookie, newValue: userPlaylistIdCookie });
        } finally {
          lastCookie = userPlaylistIdCookie;
        }
      }
    }, interval);
  };

  const onConnectClick = event => {
    event.preventDefault();

    listenCookieChange(({ oldValue, newValue }) => {
      console.log(`Cookie changed from "${oldValue}" to "${newValue}"`);
      if (oldValue !== newValue) {
        setPlaylistToken(newValue);
      }
    }, 1000);

    axios.post('/connectYT').then(response => {
      window.open(
        response.data,
        'oauth window',
        'width=672,height=660,modal=yes,alwaysRaised=yes',
      );
    });
  };

  const onSetCookieClick = (event) => {
    event.preventDefault();
    dispatch(attemptCookie({ key: 333, value: 4444 })).catch(R.identity);
  };

  const onConnectYTClick = (event) => {
    listenCookieChange(({ oldValue, newValue }) => {
      console.log(`Cookie changed from "${oldValue}" to "${newValue}"`);
      if (oldValue !== newValue) {
        setPlaylistToken(newValue);
      }
    }, 1000);

    event.preventDefault();
    dispatch(attemptConnectYT()).catch(R.identity);
  };

  return (
    <div className="flex flex-col m-auto text-center">
      {scheduledVideos.length === 0 && (
        <div>
          <form action="connectYT" method="post">
            <h3 className="text-center mt-20 text-3xl mb-12">
              Connect your YouTube account to get started!
            </h3>
            <button
              type="submit"
              onClick={onConnectClick}
              className="bg-orange-500 rounded font-bold text-white mx-auto p-4"
            >
              CONNECT
            </button>
          </form>
          <form action="someCookie" method="post">
            <button onClick={onSetCookieClick} type="submit">
              set cookie
            </button>
          </form>
          <form action="connectYouTube" method="post">
            <button onClick={onConnectYTClick} type="submit">
              connect to youtube
            </button>
          </form>
        </div>
      )}
      {playlistToken && <p>authenticated!</p>}
      {scheduledVideos.length > 0 && (
        <Calendar scheduledVideos={scheduledVideos} />
      )}
    </div>
  );
}
