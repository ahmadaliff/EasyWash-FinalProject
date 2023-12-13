import Proptypes from 'prop-types';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close, DryCleaning } from '@mui/icons-material';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';
import MapRouting from '@components/MapRouting';

import classes from '@components/DetailOrder/style.module.scss';

const EditProfile = ({ order, open, handleClose }) => (
  <Dialog open={open} onClose={handleClose} fullWidth>
    <DialogTitle fontSize="larger">
      <FormattedMessage id="app_detail_order" />
    </DialogTitle>
    <IconButton
      aria-label="close"
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
      <div>
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
              <FormattedNumber value={order?.totalPrice} style="currency" currency="IDR" minimumFractionDigits={0} />
            }
          </p>
        </div>
        <div className={classes.field}>
          <p className={classes.label}>Status</p>
          <p className={classes.text}>
            <FormattedMessage id={order?.status} />
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
      </div>
    </DialogContent>
  </Dialog>
);

EditProfile.propTypes = {
  order: Proptypes.object,
  open: Proptypes.bool,
  handleClose: Proptypes.func,
};

export default injectIntl(EditProfile);
