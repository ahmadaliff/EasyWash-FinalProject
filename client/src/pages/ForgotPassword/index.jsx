import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link, useNavigate } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';

import InputRHF from '@components/InputRHF';

import { actionSendForgotPassword } from '@containers/Client/actions';
import { selectLogin } from '@containers/Client/selectors';

import classes from '@pages/ForgotPassword/style.module.scss';

const ForgotPassword = ({ login, intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm();
  const email = watch('email');

  useEffect(() => {
    if (login) {
      toast.error(formatMessage({ id: 'app_already_login' }));
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  }, [formatMessage, login, navigate]);

  const onSubmit = (data) => {
    dispatch(
      actionSendForgotPassword(data, () => {
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      })
    );
  };

  return (
    <main className={classes.mainWrap}>
      <div onClick={() => navigate('/')} className={classes.logoHeader}>
        <img src="longLogo.svg" alt="logo" className={classes.logo} />
      </div>
      <div className={classes.forgotPasswordCard}>
        <h3 className={classes.forgotPasswordHeader}>
          <FormattedMessage id="app_forgot_password" />
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          <InputRHF
            input={{
              name: 'email',
              required: formatMessage({ id: 'app_user_email_require_message' }),
              type: 'text',
              label: formatMessage({ id: 'app_user_email' }),
              pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i,
              messagePatern: formatMessage({ id: 'app_user_email_pattern_message' }),
            }}
            register={register}
            errors={errors}
          />
          <button type="submit" className={classes.buttonSubmit} disabled={!email}>
            <FormattedMessage id="app_forgot_password" />
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

ForgotPassword.propTypes = {
  intl: PropTypes.object,
  login: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  login: selectLogin,
});

export default injectIntl(connect(mapStateToProps)(ForgotPassword));
