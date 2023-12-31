import PropTypes from 'prop-types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage, injectIntl } from 'react-intl';

import InputRHF from '@components/InputRHF';
import MapLeaflet from '@components/MapLeaflet';

import { styled } from '@mui/material/styles';
import { AccountBox, LocalLaundryService } from '@mui/icons-material';
import { FormControl, FormGroup, ToggleButton, ToggleButtonGroup } from '@mui/material';

import { selectIsVerify } from '@containers/Client/selectors';
import { actionSetMerchant, actionSetRole, actionSetStep } from '@pages/Register/actions';
import { selectEmail, selectMerchant, selectRole, selectStep } from '@pages/Register/selectors';

import classes from '@components/RegisterRole/style.module.scss';

const RegisterRole = ({ rolePersist, merchant, isVerified, step, intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const [role, setRole] = useState(rolePersist || 'user');
  const [location, setLocation] = useState();

  const handleChange = (e, value) => {
    setRole(value);
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm();
  const name = watch('name');
  const description = watch('description');

  const StyledToggleButton = styled(ToggleButton)({
    '&.Mui-selected, &.Mui-selected:hover': {
      color: 'white',
      backgroundColor: '#7ac94c',
      border: 'none',
    },
  });

  const handleLocation = (loc) => {
    setLocation(loc);
  };

  const onSubmit = (data) => {
    dispatch(actionSetRole(role));
    if (role !== 'user') {
      data.location = location && JSON.stringify(location);
      dispatch(actionSetMerchant(data));
    }
    dispatch(actionSetStep(3));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="register-role">
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
          data-testid="role"
        >
          <StyledToggleButton data-testid="button-role-user" value="user">
            <AccountBox /> <FormattedMessage id="app_user" />
          </StyledToggleButton>
          <StyledToggleButton data-testid="button-role-merchant" value="merchant">
            <LocalLaundryService /> Laundry
          </StyledToggleButton>
        </ToggleButtonGroup>
      </FormGroup>
      {role !== 'user' && (
        <>
          <h5 className={classes.merchantFormHeader}>Merchant Info</h5>
          <InputRHF
            input={{
              name: 'name',
              required: formatMessage({ id: 'app_merchant_require' }),
              type: 'text',
              label: formatMessage({ id: 'app_merchant_name' }),
              value: merchant?.name,
            }}
            register={register}
            errors={errors}
          />
          <FormControl fullWidth>
            <div className={classes.inputLabel}>
              <FormattedMessage id="app_location" />
              <MapLeaflet handleLocation={handleLocation} islocated={merchant?.location} permanent={false} />
            </div>
          </FormControl>
          <FormControl className={classes.inputContainer}>
            <label htmlFor="description" className={classes.inputLabel}>
              <FormattedMessage id="app_description" />
              <textarea
                className={`${classes.inputTextArea} ${errors.description && classes.inputError}`}
                {...register('description', {})}
                defaultValue={merchant?.description}
                data-testid="input-description"
              />
            </label>
          </FormControl>
        </>
      )}
      <div className={classes.buttonWrap}>
        <button
          type="button"
          className={classes.buttonSubmit}
          onClick={() => (isVerified ? dispatch(actionSetStep(step - 2)) : dispatch(actionSetStep(step - 1)))}
        >
          <FormattedMessage id="app_back" />
        </button>
        <button
          type="submit"
          className={classes.buttonSubmit}
          disabled={role !== 'user' ? !role || !name || !description : !role}
          data-testid="button-submit"
        >
          <FormattedMessage id="app_next" />
        </button>
      </div>
    </form>
  );
};

RegisterRole.propTypes = {
  intl: PropTypes.object,
  step: PropTypes.number,
  email: PropTypes.string,
  rolePersist: PropTypes.string,
  isVerified: PropTypes.bool,
  merchant: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  step: selectStep,
  email: selectEmail,
  isVerified: selectIsVerify,
  rolePersist: selectRole,
  merchant: selectMerchant,
});

export default injectIntl(connect(mapStateToProps)(RegisterRole));
