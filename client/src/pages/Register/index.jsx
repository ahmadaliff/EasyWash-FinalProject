import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link, useNavigate } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';

import { Card, CardContent } from '@mui/material';

import VerifyEmail from '@components/VerifyEmail';
import RegisterForm from '@components/RegisterForm';
import RegisterRole from '@components/RegisterRole';
import VerifyEmailOTP from '@components/VerifyEmailOTP';

import { selectLogin } from '@containers/Client/selectors';
import { selectStep } from '@pages/Register/selectors';
import { actionResetRegisterValue } from '@containers/Client/actions';
import { actionHandleResetStep } from '@pages/Register/actions';

import classes from '@pages/Register/style.module.scss';

const Register = ({ isLogin, step, intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLogin) {
      toast.error(formatMessage({ id: 'app_user_already_login' }));
      navigate('/');
    }
  }, [formatMessage, isLogin, navigate]);

  const renderStep = () => {
    switch (step) {
      case 0:
        return <VerifyEmail />;
      case 1:
        return <VerifyEmailOTP />;
      case 2:
        return <RegisterRole />;
      case 3:
        return <RegisterForm />;
    }
  };

  return (
    <main className={classes.main} data-testid="register-page">
      <div onClick={() => navigate('/')} className={classes.logoHeader} data-testid="logo">
        <img src="longLogo.svg" alt="logo" className={classes.logo} />
      </div>
      <div className={classes.ilustrationWrap}>
        <img src="register.svg" className={classes.registerIlustration} alt="https://storyset.com" />
        <a href="https://storyset.com/web" className={classes.storySet}>
          Web illustrations by Storyset
        </a>
      </div>
      <div className={classes.content}>
        <Card className={classes.registerCard}>
          <CardContent>
            <div className={classes.headerRegister}>
              <h3>
                <FormattedMessage id="app_header_register" />
              </h3>
              <Link
                to="/Login"
                onClick={() => {
                  dispatch(actionResetRegisterValue());
                  dispatch(actionHandleResetStep());
                }}
              >
                <FormattedMessage id="app_header_login" />
              </Link>
            </div>
            {renderStep()}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

Register.propTypes = {
  intl: PropTypes.object,
  isLogin: PropTypes.bool,
  step: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  isLogin: selectLogin,
  step: selectStep,
});

export default injectIntl(connect(mapStateToProps)(Register));
