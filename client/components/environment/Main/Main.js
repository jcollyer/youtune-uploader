import React, { useEffect, useState } from 'react';
import * as R from 'ramda';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ReactNotifications } from 'react-notifications-component';
import { useDispatch } from 'react-redux';

import WelcomePage from '../../pages/WelcomePage';
import LoginPage from '../../pages/LoginPage';
import RegisterPage from '../../pages/RegisterPage';
import HomePage from '../../pages/HomePage';
import UploadPage from '../../pages/UploadPage';
import SettingsPage from '../../pages/SettingsPage';
import LostPage from '../../pages/LostPage';

import Navigation from '../../organisms/Navigation';
import Footer from '../../organisms/Footer';
import { attemptGetUser } from '../../../store/thunks/user';

import styles from './styles.module.css';

export default function Main() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    let subscribed = true;

    dispatch(attemptGetUser())
      .then(() => subscribed && setLoading(false))
      .catch(R.identity);

    return () => {
      subscribed = false;
    };
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    !loading && (
      <React.Fragment>
        <ReactNotifications />
        <Navigation />
        <div className={styles.root}>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="home" element={<HomePage />} />
            {/* <Route path="todo" element={<TodoPage />} /> */}
            <Route path="upload" element={<UploadPage />} />
            <Route path="settings/*" element={<SettingsPage />} />
            <Route path="*" element={<LostPage />} />
          </Routes>
        </div>
        <Footer />
      </React.Fragment>
    )
  );
}
