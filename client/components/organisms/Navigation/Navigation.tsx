import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Navbar from 'react-bulma-companion/lib/Navbar';
import Image from 'react-bulma-companion/lib/Image';
import Title from 'react-bulma-companion/lib/Title';

import UserDropdown from '../../molecules/UserDropdown';

import type { User } from '../../../types/user';
import type { RootState } from '../../../store';

export default function Navigation() {
  const { user }: User = useSelector((state: RootState) => state.user);

  const [auth, setAuth] = useState(user);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setAuth(user);
  }, [user]);

  const toggleDropdown = () => setOpen(!open);

  const closeDropdown = () => setOpen(false);

  return (
    <Navbar fixed="top">
      <Navbar.Brand>
        <Navbar.Item
          to={auth ? '/home' : '/'}
          aria-label="main navigation"
          component={Link}
        >
          <img src="/images/icon.png" width="36" height="36" alt="icon" />
        </Navbar.Item>
        <Navbar.Item
          to={auth ? '/upload' : '/'}
          aria-label="main navigation"
          component={Link}
        >
          <img src="/images/yt-shorts-logo.png" width="25" height="25" alt="icon" />
        </Navbar.Item>
        <div className="navbar-brand-right">
          {!auth && (
            <Navbar.Item
              className="is-hidden-desktop"
              to="/login"
              component={Link}
            >
              <Title size="6">Login</Title>
            </Navbar.Item>
          )}
          {!auth && (
            <Navbar.Item
              className="is-hidden-desktop"
              to="/register"
              component={Link}
            >
              <button
                className="font-bold py-2 px-4 rounded border border-slate-400 hover:border-slate-500"
                type="button"
              >
                Sign Up
              </button>
            </Navbar.Item>
          )}
          {auth && (
            <Navbar.Item
              className="is-hidden-desktop"
              onClick={toggleDropdown}
              onKeyPress={toggleDropdown}
              hoverable
              component="a"
            >
              <Image size="32x32">
                <Image.Content
                  className="profile-img"
                  src={user.profilePic || '/images/default-profile.png'}
                />
              </Image>
              <span className="dropdown-caret" />
            </Navbar.Item>
          )}
        </div>
      </Navbar.Brand>

      {auth ? (
        <Navbar.Menu>
          <Navbar.End>
            <Navbar.Item
              onClick={toggleDropdown}
              onKeyPress={toggleDropdown}
              hoverable
              component="a"
            >
              <Image size="32x32">
                <Image.Content
                  className="profile-img"
                  src={user.profilePic || '/images/default-profile.png'}
                />
              </Image>
              <span className="dropdown-caret" />
            </Navbar.Item>
          </Navbar.End>
        </Navbar.Menu>
      ) : (
        <Navbar.Menu>
          <Navbar.End>
            <Navbar.Item to="/login" component={Link}>
              <Title size="6">Login</Title>
            </Navbar.Item>
            <Navbar.Item to="/register" component={Link}>
              <button
                className="font-bold py-2 px-4 rounded border bg-orange-500 border-orange-500 text-white"
                type="button"
              >
                Sign Up
              </button>
            </Navbar.Item>
          </Navbar.End>
        </Navbar.Menu>
      )}
      <UserDropdown open={open} closeDropdown={closeDropdown} />
    </Navbar>
  );
}
