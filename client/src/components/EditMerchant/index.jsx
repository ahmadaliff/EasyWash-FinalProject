import Proptypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { FormattedMessage, injectIntl } from 'react-intl';

import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

import InputRHF from '@components/InputRHF';
import MapLeaflet from '@components/MapLeaflet';

import { actionEditMerchant } from '@pages/MyMerchant/actions';

import classes from '@components/EditMerchant/style.module.scss';

const EditMerchant = ({ merchant, open, handleClose, intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const [location, setLocation] = useState();
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm();

  const name = watch('name');
  const description = watch('description');

  const onSubmit = (data) => {
    data.location = location ? JSON.stringify(location) : JSON.parse(merchant?.location);
    dispatch(actionEditMerchant(data));
    handleClose();
  };

  const handleLocation = (loc) => {
    setLocation(loc);
  };

  return (
    <Dialog open={open} onClose={handleClose} data-testid="dialog-edit-merchant">
      <DialogTitle fontSize="larger">
        <FormattedMessage id="app_edit_merchant" />
      </DialogTitle>
      <IconButton
        aria-label="close"
        data-testid="button-close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
        }}
      >
        <Close />
      </IconButton>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
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
              <MapLeaflet
                handleLocation={handleLocation}
                islocated={merchant && JSON.parse(merchant?.location)}
                permanent={false}
              />
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
          <DialogActions>
            <button
              type="submit"
              className={classes.buttonSubmit}
              disabled={!name || !description}
              data-testid="button-submit"
            >
              <FormattedMessage id="app_edit_merchant" />
            </button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

EditMerchant.propTypes = {
  merchant: Proptypes.object,
  intl: Proptypes.object,
  open: Proptypes.bool,
  handleClose: Proptypes.func,
};

export default injectIntl(EditMerchant);
