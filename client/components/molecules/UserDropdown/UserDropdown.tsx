import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import Box from 'react-bulma-companion/lib/Box';
import { attemptLogout } from '../../../store/thunks/auth';
import type { User } from '../../../types/user';
import { RootState } from '../../../store';

type Props = {
  open: boolean,
  closeDropdown: () => void,
};

export default function UserDropdown({ open, closeDropdown }:Props) {
  const dispatch = useDispatch();
  const { user }:User = useSelector((store:RootState) => store.user);

  const dropdown = useRef(null);

  useEffect(() => {
    let init = false;

    const dropdownListener = (e:any) => {
      if (!e.composedPath().includes(dropdown.current) && open && init) {
        closeDropdown();
      }
      init = true;
    };

    window.addEventListener('click', dropdownListener);
    window.addEventListener('touchend', dropdownListener);

    return () => {
      window.removeEventListener('click', dropdownListener);
      window.removeEventListener('touchend', dropdownListener);
    };
  }, [open, closeDropdown]);

  const logout = () => {
    closeDropdown();
    dispatch(attemptLogout())
      .catch(R.identity);
  };

  return open && (
    <Box className="dropdown" ref={dropdown}>
      <ul className="dropdown-list">
        <li className="dropdown-header">
          {user.usernameCase}
        </li>
        <hr className="dropdown-separator" />
        <li className="dropdown-item">
          <Link to="/home" onClick={closeDropdown}>
            Home
          </Link>
        </li>
        <li className="dropdown-item">
          <Link to="/upload" onClick={closeDropdown}>
            Upload Video
          </Link>
        </li>
        <li className="dropdown-item">
          <Link to="/settings" onClick={closeDropdown}>
            Settings
          </Link>
        </li>
        <hr className="dropdown-separator" />
        <li className="dropdown-item">
          <a onClick={logout} onKeyPress={logout}>
            Logout
          </a>
        </li>
      </ul>
    </Box>
  );
}
