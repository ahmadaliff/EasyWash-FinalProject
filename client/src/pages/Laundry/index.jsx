import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate, useParams } from 'react-router-dom';
import { FormattedMessage, FormattedNumber } from 'react-intl';

import { Button, Card, CardContent } from '@mui/material';
import { ArrowBack, DryCleaning } from '@mui/icons-material';

import NoData from '@components/NoData';
import MerchantInfo from '@components/MerchantInfo';
import { selectMerchant } from '@pages/Laundry/selectors';

import ServiceDialog from '@components/ServiceDialog';

import { actionGetMerchant, actionResetMerchant } from '@pages/Laundry/action';

import classes from '@pages/Laundry/style.module.scss';

const Laundry = ({ merchant }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [openDialog, setOpenDialog] = useState(false);
  const [serviceProps, setServiceProps] = useState(null);

  useEffect(() => {
    if (!merchant) dispatch(actionGetMerchant(id));
    return () => {
      if (merchant) dispatch(actionResetMerchant());
    };
  }, [dispatch, id, merchant]);

  return (
    <main className={classes.mainWrap}>
      <div className={classes.header}>
        <h3>
          <FormattedMessage id="app_merchant_header" />
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
        <CardContent className={classes.cardContent}>
          <MerchantInfo merchant={merchant} />
          {merchant?.Services?.map((service, k) => (
            <div key={k}>
              <div
                className={classes.service}
                onClick={() => {
                  setOpenDialog(true);
                  setServiceProps(service);
                }}
              >
                <DryCleaning />
                <div className={classes.serviceInfoWrap}>
                  <div className={classes.serviceInfo}>
                    <p>{service?.name}</p>
                    <p>
                      <FormattedNumber
                        value={service?.price}
                        // eslint-disable-next-line react/style-prop-object
                        style="currency"
                        currency="IDR"
                        minimumFractionDigits={0}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <ServiceDialog handleClose={() => setOpenDialog(false)} open={openDialog} service={serviceProps} />
          {merchant?.Services?.length === 0 && <NoData />}
          {!merchant && <NoData />}
        </CardContent>
      </Card>
    </main>
  );
};

Laundry.propTypes = {
  merchant: PropTypes.object,
};
const mapStateToProps = createStructuredSelector({
  merchant: selectMerchant,
});
export default connect(mapStateToProps)(Laundry);
