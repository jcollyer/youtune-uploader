import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import axios from 'axios';
import * as R from 'ramda';
import Cookies from 'js-cookie';
import Calendar from '../../organisms/Calendar/Calendar';
import type { User } from '../../../types/user';

export default function HomePage() {
  const dispatch = useDispatch();
  const { user }:User = useSelector((state) => state.user);
  const [playlistToken, setPlaylistToken] = useState(
    Cookies.get('userPlaylistId'),
  );
  const [scheduledVideos, setscheduledVideos] = useState([]);

  useEffect(() => {
    if (playlistToken) {
      axios
        .post('/api/auth/getUnlisted', {
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
      const userPlaylistId = Cookies.get('userPlaylistId');
      if (userPlaylistId !== lastCookie) {
        try {
          callback({ oldValue: lastCookie, newValue: userPlaylistId });
        } finally {
          lastCookie = userPlaylistId;
        }
      }
    }, interval);
  };

  const onConnectYTClick = event => {
    event.preventDefault();
    listenCookieChange(({ oldValue, newValue }) => {
      console.log(`Cookie changed from "${oldValue}" to "${newValue}"`);
      if (oldValue !== newValue) {
        setPlaylistToken(newValue);
      }
    }, 1000);

    axios
      .post('/api/auth/connectYouTube')
      .then(response =>
        window.open(response.data, 'oauth window', 'width=500,height=500'),
      );
  };

  return (
    <div className="flex flex-col m-auto text-center">
      {scheduledVideos.length === 0 && (
        <div className="pt-64">
          <form action="connectYouTube" method="post">
            <h3 className="text-center mt-20 text-3xl mb-12">
              Connect your YouTube account to get started!
            </h3>
            <button
              type="submit"
              onClick={onConnectYTClick}
              className="font-bold py-2 px-4 rounded border border-slate-400 hover:border-slate-500"
            >
              CONNECT
            </button>
          </form>
        </div>
      )}
      {scheduledVideos.length > 0 && (
        <Calendar
          scheduledVideos={scheduledVideos}
          setLocallScheduledVideoData={setscheduledVideos}
        />
      )}
    </div>
  );
}
