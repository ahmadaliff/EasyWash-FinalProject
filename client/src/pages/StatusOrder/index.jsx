import { PropTypes } from 'prop-types';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';

import {
  actionConnectSocket,
  actionDisconnectSocket,
  actionGetStatus,
  watchStatusUpdates,
} from '@pages/StatusOrder/actions';
import { createStructuredSelector } from 'reselect';
import { selectOrder } from './selectors';

const StatusOrder = ({ order }) => {
  const dispatch = useDispatch();
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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Order Details</h2>
      {console.log(order.status)}
      {/* <p>Order ID: {order.id}</p>
      <p>Status: {order.status}</p> */}
    </div>
  );
};

StatusOrder.propTypes = {
  order: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  order: selectOrder,
});

export default connect(mapStateToProps)(StatusOrder);
