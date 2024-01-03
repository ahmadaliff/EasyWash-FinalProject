import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate, useParams } from 'react-router-dom';
import { FormattedMessage, FormattedNumber } from 'react-intl';

import { Button, Card, CardContent } from '@mui/material';
import { ArrowBack, DoNotDisturb, DryCleaning, Payment } from '@mui/icons-material';

import NoData from '@components/NoData';
import MapRouting from '@components/MapRouting';
import MerchantInfo from '@components/MerchantInfo';
import DialogReceipt from '@components/DialogReceipt';

import { actionCancelOrder } from '@pages/MyOrder/action';
import {
  actionConnectSocket,
  actionDisconnectSocket,
  actionGetStatus,
  actionPay,
  watchStatusUpdates,
} from '@pages/StatusOrder/actions';
import { selectOrder } from '@pages/StatusOrder/selectors';

import classes from '@pages/StatusOrder/style.module.scss';

const StatusOrder = ({ order }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(actionConnectSocket());
    dispatch(actionGetStatus(orderId));
    dispatch(watchStatusUpdates(orderId));
    return () => {
      if (order) {
        dispatch(actionDisconnectSocket());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, orderId]);

  if (!order) {
    return <NoData />;
  }

  return (
    <main className={classes.mainWrap} data-testid="status-order">
      <div className={classes.header}>
        <h3>
          <FormattedMessage id="app_detail_order" />
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
        <CardContent>
          <MerchantInfo merchant={order?.Services[0]?.Merchant} chat={false} />
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
              <FormattedNumber
                value={order?.totalPrice}
                // eslint-disable-next-line react/style-prop-object
                style="currency"
                currency="IDR"
                minimumFractionDigits={0}
              />
            </p>
          </div>
          <div className={classes.field}>
            <p className={classes.label}>Status</p>
            <p className={classes.text}>
              <FormattedMessage id={order?.status} />
            </p>
          </div>
          {(order?.status === 'app_pickUp' ||
            order?.status === 'app_onProcess' ||
            order?.status === 'app_onDelivery' ||
            order?.status === 'app_finish') && (
            <div className={classes.field}>
              <Button variant="contained" className={classes.downloadButton} onClick={() => setIsOpen(true)}>
                <FormattedMessage id="app_receipt" />
              </Button>
            </div>
          )}
          {order?.Services?.map((service, key) => (
            <div className={classes.service} key={key}>
              <DryCleaning />
              <div className={classes.serviceInfoWrap}>
                <hr />
                <div className={classes.serviceInfo}>
                  <div className={classes.name}>
                    <p>
                      {service?.name} x {service?.ServicesOrdered?.quantity}
                    </p>
                    <p className={classes.type}>
                      <FormattedMessage id="app_type" />
                      <FormattedMessage id={service?.isUnit ? 'app_unit' : 'app_kilo'} />
                    </p>
                  </div>
                  <p>
                    <FormattedNumber
                      // eslint-disable-next-line no-unsafe-optional-chaining
                      value={service?.ServicesOrdered?.price * service?.ServicesOrdered?.quantity}
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
          {order?.status === 'app_payment' && (
            <Button
              variant="contained"
              className={classes.payButton}
              startIcon={<Payment />}
              onClick={() => dispatch(actionPay(order?.id))}
            >
              <FormattedMessage id="app_pay" />
            </Button>
          )}
          <Button
            variant="contained"
            className={classes.cancelButton}
            startIcon={<DoNotDisturb />}
            onClick={() => dispatch(actionCancelOrder(order.id, () => navigate(-1)))}
            disabled={order?.status !== 'app_pending'}
            data-testid="button-cancel"
          >
            <FormattedMessage id="app_cancel" />
          </Button>
        </CardContent>
      </Card>
      <DialogReceipt open={isOpen} handleClose={() => setIsOpen(false)} order={order} />
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
