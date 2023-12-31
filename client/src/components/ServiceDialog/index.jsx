import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage, FormattedNumber } from 'react-intl';

import { Button, DialogActions, DialogContent, DialogTitle, IconButton, SwipeableDrawer } from '@mui/material';
import { Add, AddShoppingCart, Close, LibraryBooksOutlined, Remove } from '@mui/icons-material';

import { actionAddToCart } from '@pages/Cart/action';
import { actionSetOrder } from '@pages/Order/action';

import classes from '@components/ServiceDialog/style.module.scss';

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
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={handleClose}
      onOpen={() => open}
      className={classes.dialog}
      data-testid="dialog-service"
    >
      <DialogTitle fontSize="large">
        <b>
          <FormattedMessage id="app_service_datail" />
        </b>
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
          <div className={classes.field}>
            <p className={classes.label}>
              <FormattedMessage id="app_type" />
            </p>
            <p className={classes.text}>
              <FormattedMessage id={service?.isUnit ? 'app_kilo' : 'app_unit'} />
            </p>
          </div>
        </div>
        <div className={classes.buttonQuantity}>
          <IconButton onClick={() => setQuantity(quantity - 1)} disabled={quantity - 1 === 0} data-testid="button-min">
            <Remove />
          </IconButton>
          {quantity}
          <IconButton onClick={() => setQuantity(quantity + 1)} data-testid="button-plus">
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
          data-testid="button-add"
        >
          <FormattedMessage id="app_add_to_cart" />
        </Button>
        <Button
          variant="contained"
          className={classes.dialogAction}
          startIcon={<LibraryBooksOutlined />}
          onClick={handleCreateOrder}
          data-testid="button-create"
        >
          <FormattedMessage id="app_create_order" />
        </Button>
      </DialogActions>
    </SwipeableDrawer>
  );
};

ServiceDialog.propTypes = {
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  service: PropTypes.object,
};

export default ServiceDialog;
