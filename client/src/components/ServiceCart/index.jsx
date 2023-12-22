import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { FormattedNumber } from 'react-intl';

import { Add, Delete, DryCleaning, Remove } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { actionChangeQuantity, actionDeleteFromCart } from '@pages/Cart/action';

import classes from '@components/ServiceCart/style.module.scss';

const ServiceCart = ({ service }) => {
  const dispatch = useDispatch();
  return (
    <div className={classes.service} data-testid="service-cart">
      <DryCleaning />
      <div className={classes.serviceInfoWrap}>
        <div className={classes.serviceInfo}>
          <p>{service?.name}</p>
          <p>
            <FormattedNumber
              // eslint-disable-next-line no-unsafe-optional-chaining
              value={service?.price * service?.Carts[0].quantity}
              // eslint-disable-next-line react/style-prop-object
              style="currency"
              currency="IDR"
              minimumFractionDigits={0}
            />
          </p>
        </div>
        <div className={classes.quantity}>
          <div>
            <IconButton
              onClick={() => dispatch(actionChangeQuantity(service?.id, parseInt(service?.Carts[0].quantity, 10) - 1))}
              disabled={parseInt(service?.Carts[0].quantity, 10) - 1 === 0}
              data-testid="button-min"
            >
              <Remove />
            </IconButton>
            {service?.Carts[0].quantity}
            <IconButton
              onClick={() => dispatch(actionChangeQuantity(service?.id, parseInt(service?.Carts[0].quantity, 10) + 1))}
              data-testid="button-plus"
            >
              <Add />
            </IconButton>
          </div>
          <IconButton
            className={classes.delete}
            onClick={() => dispatch(actionDeleteFromCart(service?.Carts[0].id))}
            data-testid="button-delete"
          >
            <Delete />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

ServiceCart.propTypes = {
  service: PropTypes.object,
};

export default ServiceCart;
