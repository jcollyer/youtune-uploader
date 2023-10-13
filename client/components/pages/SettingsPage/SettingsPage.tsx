import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import { Routes, Route } from 'react-router-dom';

import Section from 'react-bulma-companion/lib/Section';
import Container from 'react-bulma-companion/lib/Container';
import Columns from 'react-bulma-companion/lib/Columns';
import Column from 'react-bulma-companion/lib/Column';

import SettingsMenu from './SettingsMenu/SettingsMenu';
import ProfileSettings from './ProfileSettings';
import AccountSettings from './AccountSettings';

import type { User } from '../../../types/user';
import type { RootState } from '../../../store';

export default function SettingsPage() {
  const dispatch = useDispatch();
  const { user }:User = useSelector((store:RootState) => store.user);

  useEffect(() => {
    if (!user) {
      dispatch(push('/login'));
    }
  }, [dispatch, user]);

  return (
    <div className="settings-page page">
      <Section>
        <Container>
          <Columns>
            <Column size="3">
              <SettingsMenu />
            </Column>
            <Column size="9">
              <Routes>
                <Route path="profile" element={<ProfileSettings />} />
                <Route path="account" element={<AccountSettings />} />
                <Route path="*" element={<ProfileSettings />} />
              </Routes>
            </Column>
          </Columns>
        </Container>
      </Section>
    </div>
  );
}
