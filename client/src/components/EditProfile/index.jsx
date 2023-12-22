import Proptypes from 'prop-types';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { FormattedMessage, injectIntl } from 'react-intl';

import classes from '@components/EditProfile/style.module.scss';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import InputRHF from '@components/InputRHF';

import { actionEditProfile } from '@pages/Profile/actions';

const EditProfile = ({ profile, open, handleClose, intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm();
  const fullName = watch('fullName');
  const phone = watch('phone');

  const onSubmit = (data) => {
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
          <InputRHF
            input={{
              name: 'phone',
              required: formatMessage({ id: 'app_user_phone_require_message' }),
              type: 'number',
              label: formatMessage({ id: 'app_user_phone' }),
              minLength: 8,
              messageMin: formatMessage({ id: 'app_user_phone_min_length' }),
              value: profile?.phone,
            }}
            register={register}
            errors={errors}
          />
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
