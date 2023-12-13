import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage, FormattedNumber } from 'react-intl';

import MapLeaflet from '@components/MapLeaflet';
import NoData from '@components/NoData';

import { ArrowBack, DryCleaning } from '@mui/icons-material';
import { Button } from '@mui/material';

import { selectOrder } from '@pages/Order/selectors';
import { actionCreateOrder, actionResetOrder } from '@pages/Order/action';

import classes from '@pages/Order/style.module.scss';
import { selectUser } from '@containers/Client/selectors';

const Order = ({ user, orders }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [location, setLocation] = useState();

  useEffect(() => {
    user?.role !== 'user' && navigate(-1);
    return () => {
      if (orders) dispatch(actionResetOrder());
    };
  }, [dispatch, navigate, orders, user]);

  const handleLocation = (loc) => {
    setLocation(loc);
  };

  const getTotalPrice = () => {
    let totalPrice = 0;
    orders?.forEach((order) => {
      totalPrice += order.servicePrice * order.quantity;
    });
    return totalPrice;
  };

  const handleOrder = () => {
    const orderItems = orders.map(({ serviceName, servicePrice, createdAt, updatedAt, userId, ...order }) => order);
    dispatch(actionCreateOrder({ location: JSON.stringify(location), orderItems }, () => navigate('/user/order')));
  };
  return (
    <main className={classes.mainWrap}>
      <div className={classes.header}>
        <h3>
          <FormattedMessage id="app_detail_order" />
        </h3>
        <Button
          variant="contained"
          className={classes.backButton}
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
        >
          <FormattedMessage id="app_back" />
        </Button>
      </div>
      <div className={classes.inputLabel}>
        <FormattedMessage id="app_location_order" />
        <MapLeaflet handleLocation={handleLocation} permanent={false} />
      </div>

      <div className={classes.inputLabel}>
        <FormattedMessage id="app_detail_order" />
      </div>
      {orders?.map((order, key) => (
        <div className={classes.service} key={key}>
          <DryCleaning />
          <div className={classes.serviceInfoWrap}>
            <hr />
            <div className={classes.serviceInfo}>
              <p>
                {order?.serviceName} x {order?.quantity}
              </p>
              <p>
                <FormattedNumber
                  // eslint-disable-next-line no-unsafe-optional-chaining
                  value={order?.servicePrice * order?.quantity}
                  // eslint-disable-next-line react/style-prop-object
                  style="currency"
                  currency="IDR"
                  minimumFractionDigits={0}
                />
              </p>
            </div>
            <hr />
          </div>
        </div>
      ))}
      {(orders?.length === 0 || !orders) && <NoData />}
      <div className={classes.totalPrice}>
        <p>
          <FormattedMessage id="app_total_price" />
        </p>
        <p>
          <FormattedNumber
            value={getTotalPrice()}
            // eslint-disable-next-line react/style-prop-object
            style="currency"
            currency="IDR"
            minimumFractionDigits={0}
          />
        </p>
      </div>

      <Button
        variant="contained"
        className={classes.createButton}
        onClick={handleOrder}
        disabled={orders?.length === 0 || !orders}
      >
        <FormattedMessage id="app_order" />
      </Button>
    </main>
  );
};

Order.propTypes = {
  orders: PropTypes.array,
  user: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  orders: selectOrder,
  user: selectUser,
});
export default connect(mapStateToProps)(Order);
