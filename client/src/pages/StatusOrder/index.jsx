import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';

import {
  actionConnectSocket,
  actionDisconnectSocket,
  actionGetStatus,
  watchStatusUpdates,
} from '@pages/StatusOrder/actions';
import { createStructuredSelector } from 'reselect';
import { selectOrder } from '@pages/StatusOrder/selectors';

import classes from '@pages/StatusOrder/style.module.scss';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import MapRouting from '@components/MapRouting';
import { Button, Card, CardContent } from '@mui/material';
import { ArrowBack, DoNotDisturb, DryCleaning } from '@mui/icons-material';
import { actionCancelOrder } from '@pages/MyOrder/action';
import NoData from '@components/NoData';

const StatusOrder = ({ order }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();

  useEffect(() => {
    dispatch(actionConnectSocket(orderId));
    dispatch(actionGetStatus(orderId));
    dispatch(watchStatusUpdates());
    return () => {
      if (order) {
        dispatch(actionDisconnectSocket(orderId));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, orderId]);

  if (!order) {
    return <NoData />;
  }

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
      <Card className={classes.card}>
        <CardContent>
          <div className={classes.field}>
            <p className={classes.label}>
              <FormattedMessage id="app_order_id" />
            </p>
            <p className={classes.text}>{order?.id}</p>
          </div>
          <div className={classes.field}>
            <p className={classes.label}>
              <FormattedMessage id="app_total_price" />
            </p>
            <p className={classes.text}>
              {
                // eslint-disable-next-line react/style-prop-object
                <FormattedNumber
                  value={order?.totalPrice}
                  // eslint-disable-next-line react/style-prop-object
                  style="currency"
                  currency="IDR"
                  minimumFractionDigits={0}
                />
              }
            </p>
          </div>
          <div className={classes.field}>
            <p className={classes.label}>Status</p>
            <p className={classes.text}>
              <FormattedMessage id={order?.status} /> (realtime)
            </p>
          </div>
          {order?.Services?.map((service, key) => (
            <div className={classes.service} key={key}>
              <DryCleaning />
              <div className={classes.serviceInfoWrap}>
                <hr />
                <div className={classes.serviceInfo}>
                  <p>
                    {service?.name} x {service?.ServicesOrdered?.quantity}
                  </p>
                  <p>
                    <FormattedNumber
                      // eslint-disable-next-line no-unsafe-optional-chaining
                      value={service?.price * service?.ServicesOrdered?.quantity}
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
          <div className={classes.field}>
            <p className={classes.label}>
              <FormattedMessage id="app_location" />
            </p>
          </div>
          <MapRouting
            laundryPoint={order && JSON.parse(order?.Services[0]?.Merchant?.location)}
            userPoint={order && JSON.parse(order?.location)}
          />
          <Button
            variant="contained"
            className={classes.cancelButton}
            startIcon={<DoNotDisturb />}
            onClick={() => dispatch(actionCancelOrder(order.id, () => navigate(-1)))}
            disabled={order?.status !== 'app_pending'}
          >
            <FormattedMessage id="app_cancel" />
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

StatusOrder.propTypes = {
  order: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  order: selectOrder,
});

export default connect(mapStateToProps)(StatusOrder);
