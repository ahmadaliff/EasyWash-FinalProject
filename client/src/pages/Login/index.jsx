import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link, useNavigate } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';

import { Button, Card, CardContent } from '@mui/material';

import InputRHF from '@components/InputRHF';

import { selectLogin } from '@containers/Client/selectors';
import { actionHandleLogin, actionHandleLoginGoogle } from '@containers/Client/actions';

import classes from '@pages/Login/style.module.scss';
import { Google } from '@mui/icons-material';

const Login = ({ isLogin, intl: { formatMessage } }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);
  const [isAfterLogin, setIsAfterLogin] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm();
  const email = watch('email');
  const password = watch('password');

  useEffect(() => {
    if (isLogin && !isAfterLogin) {
      toast.error(formatMessage({ id: 'app_user_already_login' }));
      navigate('/');
    }
  }, [formatMessage, isAfterLogin, isLogin, navigate]);

  const onSubmit = (data) => {
    setIsAfterLogin(true);
    dispatch(
      actionHandleLogin(data, () => {
        setTimeout(() => {
          navigate('/');
        }, 1000);
      })
    );
  };

  return (
    <main className={classes.main}>
      <img src="login.svg" className={classes.loginIlustration} alt="https://storyset.com" />
      <div className={classes.content}>
        <div onClick={() => navigate('/')} className={classes.logoHeader}>
          <img src="longLogo.svg" alt="logo" className={classes.logo} />
        </div>
        <Card className={classes.loginCard}>
          <CardContent>
            <div className={classes.headerLogin}>
              <h3>
                <FormattedMessage id="app_header_login" />
              </h3>
              <Link to="/register">
                <FormattedMessage id="app_header_register" />
              </Link>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
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
              <p className={classes.nav}>
                <FormattedMessage id="app_forgot_password" /> ?
                <Link to="/forgotPassword">
                  <FormattedMessage id="app_forgot_password" />
                </Link>
              </p>
              <button type="submit" className={classes.buttonSubmit} disabled={!email || !password}>
                <FormattedMessage id="app_header_login" />
              </button>
            </form>
            <p className={classes.or}>
              <FormattedMessage id="app_or_login" />
            </p>
            <Button
              className={classes.buttonGoogle}
              onClick={() => dispatch(actionHandleLoginGoogle())}
              variant="outlined"
              startIcon={<Google />}
              fullWidth
            >
              Google
            </Button>
          </CardContent>
        </Card>
        <a href="https://storyset.com/web" className={classes.storySet}>
          Web illustrations by Storyset
        </a>
      </div>
    </main>
  );
};

Login.propTypes = {
  intl: PropTypes.object,
  isLogin: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  isLogin: selectLogin,
});

export default injectIntl(connect(mapStateToProps)(Login));
