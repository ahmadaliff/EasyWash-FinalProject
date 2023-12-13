import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { FormattedMessage, FormattedNumber } from 'react-intl';

import { Add, AddShoppingCart, Close, Receipt, Remove } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';

import { actionAddToCart } from '@pages/Cart/action';

import classes from '@components/ServiceDialog/style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { actionSetOrder } from '@pages/Order/action';

const ServiceDialog = ({ handleClose, open, service }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const handleCreateOrder = () => {
    const cart = [{ serviceId: service?.id, quantity, serviceName: service?.name, servicePrice: service?.price }];
    dispatch(actionSetOrder(cart));
    navigate('/order');
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth className={classes.dialog}>
      <DialogTitle fontSize="larger">
        <FormattedMessage id="app_service_datail" />
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => {
          handleClose();
          setQuantity(1);
        }}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
        }}
      >
        <Close />
      </IconButton>
      <DialogContent>
        <div>
          <div className={classes.field}>
            <p className={classes.label}>
              <FormattedMessage id="app_service_name" />
            </p>
            <p className={classes.text}>{service?.name}</p>
          </div>
          <div className={classes.field}>
            <p className={classes.label}>
              <FormattedMessage id="app_service_price" />
            </p>
            <p className={classes.text}>
              <FormattedNumber
                value={service?.price}
                // eslint-disable-next-line react/style-prop-object
                style="currency"
                currency="IDR"
                minimumFractionDigits={0}
              />
            </p>
          </div>
        </div>
        <div className={classes.buttonQuantity}>
          <IconButton onClick={() => setQuantity(quantity - 1)} disabled={quantity - 1 === 0}>
            <Remove />
          </IconButton>
          {quantity}
          <IconButton onClick={() => setQuantity(quantity + 1)}>
            <Add />
          </IconButton>
        </div>
      </DialogContent>
      <DialogActions className={classes.action}>
        <Button
          variant="contained"
          className={classes.dialogAction}
          startIcon={<AddShoppingCart />}
          onClick={() => dispatch(actionAddToCart(service?.id, quantity))}
        >
          <FormattedMessage id="app_add_to_cart" />
        </Button>
        <Button
          variant="contained"
          className={classes.dialogAction}
          startIcon={<Receipt />}
          onClick={handleCreateOrder}
        >
          <FormattedMessage id="app_create_order" />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ServiceDialog.propTypes = {
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  service: PropTypes.object,
};
export default ServiceDialog;
