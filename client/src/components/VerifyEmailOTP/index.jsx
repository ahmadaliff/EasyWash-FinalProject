import PropTypes from 'prop-types';
import Countdown from 'react-countdown';
import { useForm } from 'react-hook-form';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage, injectIntl } from 'react-intl';

import InputRHF from '@components/InputRHF';

import { selectTokenEmail } from '@containers/Client/selectors';
import { selectEmail, selectExpire, selectStep } from '@pages/Register/selectors';
import { actionSetStep } from '@pages/Register/actions';
import { actionHandleSendEmailVerify, actionHandleSendOTP } from '@containers/Client/actions';

import classes from '@components/VerifyEmailOTP/style.module.scss';

const VerifyEmailOTP = ({ tokenVerify, isExpire, email, step, intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    data.token = tokenVerify;
    dispatch(actionHandleSendOTP(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form} data-testid="verify-email-otp-form">
      <InputRHF
        input={{
          name: 'otp',
          required: formatMessage({ id: 'app_user_otp_require_message' }),
          type: 'number',
          label: formatMessage({ id: 'app_user_otp' }),
          minLength: 4,
          messageMin: formatMessage({ id: 'app_user_otp' }),
        }}
        register={register}
        errors={errors}
      />

      <div className={classes.timerComp}>
        <FormattedMessage id="app_resend" /> ?
        <Countdown date={isExpire} data-testid="countdown-timer">
          <button
            type="button"
            onClick={() => {
              dispatch(actionHandleSendEmailVerify({ email }));
              dispatch(actionSetStep(1));
            }}
            className={classes.buttonResend}
            data-testid="button-resend"
          >
            <FormattedMessage id="app_resend" />
          </button>
        </Countdown>
      </div>
      <div className={classes.buttonWrap}>
        <button
          type="button"
          className={classes.buttonSubmit}
          onClick={() => dispatch(actionSetStep(step - 1))}
          data-testid="button-back"
        >
          <FormattedMessage id="app_back" />
        </button>
        <button type="submit" className={classes.buttonSubmit} data-testid="button-submit">
          <FormattedMessage id="app_next" />
        </button>
      </div>
    </form>
  );
};

VerifyEmailOTP.propTypes = {
  intl: PropTypes.object,
  step: PropTypes.number,
  tokenVerify: PropTypes.string,
  email: PropTypes.string,
  isExpire: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  tokenVerify: selectTokenEmail,
  step: selectStep,
  email: selectEmail,
  isExpire: selectExpire,
});

export default injectIntl(connect(mapStateToProps)(VerifyEmailOTP));
