import PropTypes from 'prop-types';
import { useState } from 'react';

import classes from '@components/MerchantInfo/style.module.scss';
import { Avatar, Skeleton } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import config from '@config/index';

const MerchantInfo = ({ merchant }) => {
  const [loading, setLoading] = useState(true);
  return (
    <div className={classes.merchant}>
      <div className={classes.imgWrap}>
        {merchant?.imagePath ? (
          <>
            {loading && <Skeleton variant="square" className={classes.skeleton} />}
            <img
              src={`${config.api.server}${merchant?.imagePath}`}
              alt={merchant?.name}
              loading="lazy"
              onLoad={() => setLoading(false)}
            />
          </>
        ) : (
          <Avatar className={classes.avatar} variant="square">
            {merchant?.name?.split(' ')[0][0]}
            {merchant?.name?.split(' ').length > 1 && merchant?.name?.split(' ')[1][0]}
          </Avatar>
        )}
      </div>
      <div>
        <h4 className={classes.merchantInfoHeader}>
          {/* <FormattedMessage id="app_merchant_header" /> */}
          {merchant?.name}
        </h4>
        <span className={classes.profileInfo}>
          <p className={classes.profileLabel}>
            <FormattedMessage id="app_description" />
          </p>
          <p className={classes.profileText}>: {merchant?.description}</p>
        </span>
      </div>
    </div>
  );
};

MerchantInfo.propTypes = {
  merchant: PropTypes.object,
};

export default MerchantInfo;
