import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Button, Card, CardContent } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

import MerchantInfo from '@components/MerchantInfo';
import ServiceCart from '@components/ServiceCart';
import NoData from '@components/NoData';

import { actionGetCarts, actionResetCarts } from '@pages/Cart/action';
import { selectMerchants } from '@pages/Cart/selectors';
import { actionSetOrder } from '@pages/Order/action';

import classes from '@pages/Cart/style.module.scss';

const Cart = ({ carts }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actionGetCarts());
    return () => {
      if (carts) dispatch(actionResetCarts());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const getCartOrder = (services) => {
    const cart = [];
    services.forEach((service) => {
      service.Carts.forEach((cartObj) => {
        const obj = { ...cartObj, serviceName: service.name, servicePrice: service.price };
        cart.push(obj);
      });
    });
    return cart;
  };

  return (
    <main className={classes.mainWrap} data-testid="cart-wrap">
      <div className={classes.header}>
        <h3>
          <FormattedMessage id="app_cart_header" />
        </h3>
        <Button
          variant="contained"
          className={classes.backButton}
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          data-testid="button-back"
        >
          <FormattedMessage id="app_back" />
        </Button>
      </div>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          {carts?.map((merchant, key) => (
            <div key={key}>
              <MerchantInfo merchant={merchant} />
              {merchant?.Services?.map((service, k) => (
                <div key={k}>
                  <ServiceCart service={service} />
                </div>
              ))}
              <Button
                variant="contained"
                className={classes.createButton}
                data-testid="button-create"
                onClick={() => {
                  dispatch(actionSetOrder(getCartOrder(merchant.Services)));
                  navigate('/order');
                }}
              >
                <FormattedMessage id="app_create_order" />
              </Button>
            </div>
          ))}
          {carts?.length === 0 && <NoData />}
        </CardContent>
      </Card>
    </main>
  );
};
Cart.propTypes = {
  carts: PropTypes.array,
};
const mapStateToProps = createStructuredSelector({
  carts: selectMerchants,
});
export default connect(mapStateToProps)(Cart);
