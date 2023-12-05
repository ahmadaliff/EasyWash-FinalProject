import PropTypes from 'prop-types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage, injectIntl } from 'react-intl';

import InputRHF from '@components/InputRHF';

import { FormGroup, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { AccountBox, LocalLaundryService } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import { selectEmail, selectStep } from '@pages/Register/selectors';
import { selectIsVerify } from '@containers/Client/selectors';
import { actionHandleRegister } from '@containers/Client/actions';
import { actionSetStep } from '@pages/Register/actions';

import classes from '@components/RegisterForm/style.module.scss';

const RegisterForm = ({ isVerify, step, email, intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState('user');

  const handleChange = (e, value) => {
    setRole(value);
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm();
  const fullName = watch('fullName');
  const password = watch('password');

  const onSubmit = (data) => {
    data.email = email;
    data.role = role;
    dispatch(
      actionHandleRegister(data, () => {
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      })
    );
  };

  const StyledToggleButton = styled(ToggleButton)({
    '&.Mui-selected, &.Mui-selected:hover': {
      color: 'white',
      backgroundColor: '#7ac94c',
      border: 'none',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <p className={classes.labelRole}>
          <FormattedMessage id="app_user_role" />
        </p>
        <ToggleButtonGroup
          value={role}
          exclusive
          onChange={handleChange}
          fullWidth
          className={classes.toggleRole}
          size="small"
        >
          <StyledToggleButton value="user">
            <AccountBox /> user
          </StyledToggleButton>
          <StyledToggleButton value="laundry">
            <LocalLaundryService /> Laundry
          </StyledToggleButton>
        </ToggleButtonGroup>
      </FormGroup>
      <InputRHF
        input={{
          name: 'fullName',
          required: formatMessage({ id: 'app_user_fullName_require_message' }),
          type: 'text',
          label: formatMessage({ id: 'app_user_fullName' }),
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
        }}
        register={register}
        errors={errors}
      />
      <InputRHF
        input={{
          name: 'password',
          required: formatMessage({ id: 'app_user_password_require_message' }),
          type: showPass ? 'text' : 'password',
          label: formatMessage({ id: 'app_user_password' }),
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
      <div className={classes.buttonWrap}>
        <button
          type="button"
          className={classes.buttonSubmit}
          onClick={() => (isVerify ? dispatch(actionSetStep(step - 2)) : dispatch(actionSetStep(step - 1)))}
        >
          <FormattedMessage id="app_back" />
        </button>
        <button type="submit" className={classes.buttonSubmit} disabled={!fullName || !password}>
          <FormattedMessage id="app_header_register" />
        </button>
      </div>
    </form>
  );
};

RegisterForm.propTypes = {
  intl: PropTypes.object,
  step: PropTypes.number,
  email: PropTypes.string,
  isVerify: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  step: selectStep,
  email: selectEmail,
  isVerify: selectIsVerify,
});

export default injectIntl(connect(mapStateToProps)(RegisterForm));
