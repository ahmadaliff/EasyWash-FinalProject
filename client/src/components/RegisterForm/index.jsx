import PropTypes from 'prop-types';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage, injectIntl } from 'react-intl';

import InputRHF from '@components/InputRHF';

import intlHelper from '@utils/intlHelper';

import { selectEmail, selectRole, selectStep } from '@pages/Register/selectors';
import { actionHandleRegister } from '@containers/Client/actions';
import { actionSetStep } from '@pages/Register/actions';

import classes from '@components/RegisterForm/style.module.scss';

const RegisterForm = ({ step, role, email, intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm();
  const fullName = watch('fullName');
  const password = watch('password');
  const phone = watch('phone');

  const onSubmit = (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error(intlHelper({ message: 'app_pass_not_same' }));
    } else {
      data.email = email;
      data.role = role;
      delete data.confirmPassword;
      dispatch(
        actionHandleRegister(data, () => {
          setTimeout(() => {
            navigate('/login');
          }, 1000);
        })
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="form-register">
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
      />
      <InputRHF
        input={{
          name: 'confirmPassword',
          required: formatMessage({ id: 'app_user_confirm_password_require_message' }),
          type: showPass ? 'text' : 'password',
          label: formatMessage({ id: 'app_user_confirm_password' }),
          minLength: 8,
          messageMin: formatMessage({ id: 'app_user_confirm_password_min_length' }),
        }}
        register={register}
        errors={errors}
      >
        <label htmlFor="show" className={classes.showPassword}>
          <input
            type="checkbox"
            name="show"
            id="show"
            onChange={(e) => setShowPass(e.target.checked)}
            data-testid="button-show-pass"
          />
          <FormattedMessage id="app_user_password_show" />
        </label>
      </InputRHF>
      <div className={classes.buttonWrap}>
        <button
          type="button"
          className={classes.buttonSubmit}
          onClick={() => dispatch(actionSetStep(step - 1))}
          data-testid="button-back"
        >
          <FormattedMessage id="app_back" />
        </button>
        <button
          type="submit"
          className={classes.buttonSubmit}
          disabled={!fullName || !password || !phone}
          data-testid="button-submit"
        >
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
  role: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  step: selectStep,
  email: selectEmail,
  role: selectRole,
});

export default injectIntl(connect(mapStateToProps)(RegisterForm));
