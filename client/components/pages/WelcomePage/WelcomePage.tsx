import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import {
  YoutubeOutlined,
  DragOutlined,
  CalendarOutlined,
  VideoCameraAddOutlined,
  UploadOutlined,
} from '@ant-design/icons';

import type { RootState } from '../../../store';
import type { User } from '../../../types/user';

export default function WelcomePage() {
  const dispatch = useDispatch();
  const { user }:User = useSelector((store:RootState) => store.user);

  useEffect(() => {
    if (user) {
      dispatch(push('/home'));
    }
  }, [dispatch, user]);

  return (
    <div className="flex flex-col">
      <h1 className="fancy-text">
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
      <div className="info">
        <div className="info-block">
          <div className="description-block">
            <div className="info-icon">
              <YoutubeOutlined style={{ fontSize: '3rem', color: 'white' }} className="mr-8" />
            </div>
            <div className="info-description">Connect to YouTube</div>
          </div>
        </div>
        <div className="info-block">
          <div className="description-block">
            <div className="info-icon">
              <DragOutlined style={{ fontSize: '3rem', color: 'white' }} className="mr-8" />
            </div>
            <div className="info-description">Drag & Drop multiple videos</div>
          </div>
        </div>
        <div className="info-block">
          <div className="description-block">
            <div className="info-icon">
              <VideoCameraAddOutlined style={{ fontSize: '3rem', color: 'white' }} className="mr-8" />
            </div>
            <div className="info-description">Multi video metadata input</div>
          </div>
        </div>
        <div className="info-block">
          <div className="description-block">
            <div className="info-icon">
              <UploadOutlined style={{ fontSize: '3rem', color: 'white' }} className="mr-8" />
            </div>
            <div className="info-description">One-click multi video upload</div>
          </div>
        </div>
        <div className="info-block">
          <div className="description-block">
            <div className="info-icon">
              <CalendarOutlined style={{ fontSize: '3rem', color: 'white' }} className="mr-8" />
            </div>
            <div className="info-description">Edit scheduled videos in calander view</div>
          </div>
        </div>
      </div>
    </div>
  );
}
