import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as R from 'ramda';

import Navbar from 'react-bulma-companion/lib/Navbar';
import Image from 'react-bulma-companion/lib/Image';
import Title from 'react-bulma-companion/lib/Title';
import Button from 'react-bulma-companion/lib/Button';

import UserDropdown from '../../molecules/UserDropdown';

export default function Navigation() {
  const { pathname } = useLocation();
  const { user } = useSelector(R.pick(['user']));

  const [auth, setAuth] = useState(!R.isEmpty(user));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setAuth(!R.isEmpty(user));
  }, [user]);

  const toggleDropdown = () => setOpen(!open);

  const closeDropdown = () => setOpen(false);

  return (
    <Navbar fixed="top">
      <container>
        <Navbar.Brand className="bg-gray-800">
          <Navbar.Item
            to={auth ? '/home' : '/'}
            aria-label="main navigation"
            component={Link}
          >
            <img src="/images/icon.png" width="36" height="36" alt="icon" />
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
                  className="bg-orange-500 p-2 rounded font-bold text-white"
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
            <Navbar.Start>
              <Navbar.Item
                className="is-hidden-mobile"
                to="/home"
                active={pathname === '/home'}
                tab
                component={Link}
              >
                <Title size="6">Home</Title>
              </Navbar.Item>
              <Navbar.Item
                className="is-hidden-mobile"
                to="/settings"
                active={pathname === '/settings'}
                tab
                component={Link}
              >
                <Title size="6">Settings</Title>
              </Navbar.Item>
            </Navbar.Start>
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
                <Button color="success">Sign Up</Button>
              </Navbar.Item>
            </Navbar.End>
          </Navbar.Menu>
        )}
        <UserDropdown open={open} closeDropdown={closeDropdown} />
      </container>
    </Navbar>
  );
}
