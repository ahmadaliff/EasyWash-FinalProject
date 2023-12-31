import Proptypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import { FormattedMessage, injectIntl } from 'react-intl';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';

import InputRHF from '@components/InputRHF';

import { actionEditProfile } from '@pages/Profile/actions';

import classes from '@components/EditProfile/style.module.scss';
import 'react-phone-number-input/style.css';

const EditProfile = ({ profile, open, handleClose, intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);
  const [phone, setPhone] = useState(profile?.phone);
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm();
  const fullName = watch('fullName');

  const onSubmit = (data) => {
    data.phone = phone;
    if (!phone) delete data.phone;
    if (data.new_password === '') {
      delete data.new_password;
      delete data.old_password;
    }
    dispatch(actionEditProfile(data));
    handleClose();
  };
  return (
    <Dialog open={open} onClose={handleClose} data-testid="dialog-edit-profile">
      <DialogTitle fontSize="larger">
        <FormattedMessage id="app_profile_edit" />
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        data-testid="button-close"
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
        }}
      >
        <Close />
      </IconButton>
      <DialogContent>
        <DialogContentText fontSize="medium">
          <FormattedMessage id="app_edit_profile_desc" />
        </DialogContentText>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputRHF
            input={{
              name: 'fullName',
              required: formatMessage({ id: 'app_user_fullName_require_message' }),
              type: 'text',
              label: formatMessage({ id: 'app_user_fullName' }),
              value: profile?.fullName,
            }}
            register={register}
            errors={errors}
          />
          <FormControl fullWidth>
            <p className={classes.inputLabel}>
              <FormattedMessage id="app_user_phone" />
            </p>
            <PhoneInput
              defaultCountry="ID"
              value={phone}
              onChange={setPhone}
              className={classes.input}
              data-testid="phone-input"
            />
          </FormControl>
          <InputRHF
            input={{
              name: 'old_password',
              type: showPass ? 'text' : 'password',
              label: formatMessage({ id: 'app_user_old_password' }),
              minLength: 8,
              messageMin: formatMessage({ id: 'app_user_password_min_length' }),
            }}
            register={register}
            errors={errors}
          />
          <InputRHF
            input={{
              name: 'new_password',
              type: showPass ? 'text' : 'password',
              label: formatMessage({ id: 'app_user_new_password' }),
              minLength: 8,
              messageMin: formatMessage({ id: 'app_user_password_min_length' }),
            }}
            register={register}
            errors={errors}
          >
            <label htmlFor="show" className={classes.showPassword}>
              <input type="checkbox" name="show" id="show" onChange={(e) => setShowPass(e.target.checked)} />
              <FormattedMessage id="app_user_password_show" />
            </label>
          </InputRHF>
          <DialogActions>
            <button
              type="submit"
              className={classes.buttonSubmit}
              disabled={!fullName || !phone}
              data-testid="button-submit"
            >
              <FormattedMessage id="app_profile_edit" />
            </button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

EditProfile.propTypes = {
  profile: Proptypes.object,
  intl: Proptypes.object,
  open: Proptypes.bool,
  handleClose: Proptypes.func,
};

export default injectIntl(EditProfile);
