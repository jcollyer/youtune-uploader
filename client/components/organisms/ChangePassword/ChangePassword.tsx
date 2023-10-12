import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons/faTriangleExclamation';

import Box from 'react-bulma-companion/lib/Box';
import Field from 'react-bulma-companion/lib/Field';
import Control from 'react-bulma-companion/lib/Control';
import Block from 'react-bulma-companion/lib/Block';
import Title from 'react-bulma-companion/lib/Title';
import Label from 'react-bulma-companion/lib/Label';
import Help from 'react-bulma-companion/lib/Help';
import Input from 'react-bulma-companion/lib/Input';
import Icon from 'react-bulma-companion/lib/Icon';
import Button from 'react-bulma-companion/lib/Button';

import { attemptUpdatePassword } from '../../../store/thunks/user';
import { validatePassword } from '../../../utils/validation';

import type { User } from '../../../types/user';
import type { RootState } from '../../../store';

export default function ChangePassword() {
  const dispatch = useDispatch();
  const { user }:User = useSelector((store:RootState) => store.user);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [valid, setValid] = useState(false);

  const match = newPassword === confirmPassword;

  const updateOldPassword = e => setOldPassword(e.target.value);
  const updateConfirmPassword = e => setConfirmPassword(e.target.value);

  const handleValidatePassword = (username:string, password:string) => {
    const { valid, message } = validatePassword(username, password);
    setValid(valid);
    setMessage(message);
  };

  const updateNewPassword = e => {
    setNewPassword(e.target.value);
    handleValidatePassword(user.username, e.target.value);
  };

  const save = () => {
    if (valid && newPassword === confirmPassword && oldPassword) {
      dispatch(attemptUpdatePassword({ oldPassword, newPassword }))
        .then(() => {
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setMessage('');
          setValid(false);
        })
        .catch(R.identity);
    }
  };

  return (
    <Box className="change-password">
      <Title size="3">
        Change Password
      </Title>
      <hr className="separator" />
      <Field>
        <Label htmlFor="old-password">
          Old Password
        </Label>
        <Control>
          <Input
            id="old-password"
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={updateOldPassword}
          />
        </Control>
      </Field>
      <Block>
        <Link to="/recovery">
          Forgot your password?
        </Link>
      </Block>
      <Field className="has-help">
        <Label htmlFor="new-password">
          New Password
        </Label>
        <Control iconsRight>
          <Input
            id="new-password"
            color={newPassword ? (valid ? 'success' : 'danger') : undefined}
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={updateNewPassword}
          />
          {newPassword && (
            <Icon size="small" align="right" color={valid ? 'success' : 'danger'}>
              <FontAwesomeIcon icon={valid ? faCheck : faTriangleExclamation} />
            </Icon>
          )}
        </Control>
        {newPassword && (
          <Help color={valid ? 'success' : 'danger'}>
            {message}
          </Help>
        )}
      </Field>
      <Field className="has-help">
        <Label htmlFor="confirm-password">
          Confirm Password
        </Label>
        <Control iconsRight>
          <Input
            id="confirm-password"
            color={confirmPassword ? (match ? 'success' : 'danger') : undefined}
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={updateConfirmPassword}
          />
          {confirmPassword && (
            <Icon size="small" align="right" color={match ? 'success' : 'danger'}>
              <FontAwesomeIcon icon={match ? faCheck : faTriangleExclamation} />
            </Icon>
          )}
        </Control>
        {confirmPassword && (
          <Help color={match ? 'success' : 'danger'}>
            {match ? 'Passwords match' : 'Passwords must match'}
          </Help>
        )}
      </Field>
      <hr className="separator" />
      <Button
        color="success"
        onClick={save}
        disabled={!match || !valid || !oldPassword}
      >
        Update Password
      </Button>
    </Box>
  );
}
