import PropTypes from 'prop-types';
import { usePDF } from 'react-to-pdf';
import { FormattedMessage, FormattedNumber } from 'react-intl';

import MerchantInfo from '@components/MerchantInfo';
import { Close, DryCleaning } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, IconButton } from '@mui/material';

import classes from '@components/DialogReceipt/style.module.scss';

const DialogReceipt = ({ open, handleClose, order }) => {
  const { toPDF, targetRef } = usePDF({ filename: `Receipt-${order.id}.pdf` });
  return (
    <Dialog open={open} onClose={handleClose}>
      <IconButton
        data-testid="button-close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          zIndex: 100,
        }}
      >
        <Close />
      </IconButton>

      <DialogContent ref={targetRef} className={classes.content}>
        <h3>Receipt</h3>
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
          <p className={classes.label}>
            <FormattedMessage id="app_order_date" />
          </p>
          <p className={classes.text}>{new Date(order?.createdAt).toDateString()}</p>
        </div>
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
        <img src="/paidoff.png" alt={order.id} className={classes.paidOff} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="conatined"
          type="button"
          onClick={() => {
            toPDF();
          }}
          className={classes.downloadButton}
        >
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogReceipt.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  order: PropTypes.object,
};

export default DialogReceipt;
