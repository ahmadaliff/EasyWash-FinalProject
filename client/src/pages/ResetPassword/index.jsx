import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';

import InputRHF from '@components/InputRHF';

import intlHelper from '@utils/intlHelper';

import { actionResetPassword } from '@containers/Client/actions';
import { selectLogin } from '@containers/Client/selectors';

import classes from '@pages/ResetPassword/style.module.scss';

const ResetPassword = ({ login, intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const [showPass, setShowPass] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm();
  const newPassword = watch('new_password');
  useEffect(() => {
    if (login) {
      toast.error(formatMessage({ id: 'app_already_login' }));
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  }, [formatMessage, login, navigate]);

  useEffect(() => {
    if (!token) {
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  }, [navigate, token]);

  const onSubmit = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error(intlHelper({ message: 'app_pass_not_same' }));
    } else {
      data.token = token;
      dispatch(
        actionResetPassword(data, () => {
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        })
      );
    }
  };

  return (
    <main className={classes.mainWrap}>
      <div onClick={() => navigate('/')} className={classes.logoHeader}>
        <img src="../../longLogo.svg" alt="logo" className={classes.logo} />
      </div>
      <div className={classes.forgotPasswordCard}>
        <h2 className={classes.forgotPasswordHeader}>
          <FormattedMessage id="app_user_reset_password" />
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          <InputRHF
            input={{
              name: 'new_password',
              required: formatMessage({ id: 'app_user_password_require_message' }),
              type: showPass ? 'text' : 'password',
              label: formatMessage({ id: 'app_user_new_password' }),
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
          <button type="submit" className={classes.buttonSubmit} disabled={!newPassword}>
            <FormattedMessage id="app_user_reset_password" />
          </button>
          <div className={classes.formNav}>
            <p className={classes.nav}>
              <FormattedMessage id="app_have_account" />
              <Link to="/login">
                <FormattedMessage id="app_header_login" />
              </Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
};

ResetPassword.propTypes = {
  intl: PropTypes.object,
  login: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  login: selectLogin,
});

export default injectIntl(connect(mapStateToProps)(ResetPassword));
