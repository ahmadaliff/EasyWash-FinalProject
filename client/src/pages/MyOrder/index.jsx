import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage, FormattedNumber } from 'react-intl';

import { Button } from '@mui/material';
import { ArrowBack, DryCleaning } from '@mui/icons-material';

import { selectMyOrder } from '@pages/MyOrder/selectors';
import { actionGetMyOrder, actionResetMyOrder } from '@pages/MyOrder/action';

import classes from '@pages/MyOrder/style.module.scss';

const MyOrder = ({ orders }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!orders) dispatch(actionGetMyOrder());
    return () => {
      if (orders) dispatch(actionResetMyOrder());
    };
  }, [dispatch, navigate, orders]);
  return (
    <main className={classes.mainWrap} data-testid="my-order">
      <div className={classes.header}>
        <h3>
          <FormattedMessage id="app_detail_order" />
        </h3>
        <Button
          variant="contained"
          className={classes.backButton}
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          data-testid="back-button"
        >
          <FormattedMessage id="app_back" />
        </Button>
      </div>
      {orders?.map((order, key) => (
        <div className={classes.order} key={key}>
          <DryCleaning />
          <div className={classes.orderInfoWrap}>
            <hr />
            <div className={classes.orderInfo}>
              <div>
                <p>
                  <b>
                    <FormattedMessage id="app_order_id" /> : {order?.id}
                  </b>
                </p>
                <p>
                  <FormattedMessage id={order?.status} />
                </p>
              </div>
              <div>
                <p>
                  <FormattedNumber
                    value={order?.totalPrice}
                    // eslint-disable-next-line react/style-prop-object
                    style="currency"
                    currency="IDR"
                    minimumFractionDigits={0}
                  />
                </p>
                <div
                  className={classes.buttonDetail}
                  onClick={() => navigate(`/user/order/status/${order?.id}`)}
                  data-testid="button-order-detail"
                >
                  <FormattedMessage id="app_detail_order" />
                </div>
              </div>
            </div>
            <hr />
          </div>
        </div>
      ))}
    </main>
  );
};

MyOrder.propTypes = {
  orders: PropTypes.array,
};
const mapStateToProps = createStructuredSelector({
  orders: selectMyOrder,
});
export default connect(mapStateToProps)(MyOrder);
