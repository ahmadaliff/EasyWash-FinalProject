import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Avatar, IconButton, Skeleton } from '@mui/material';
import { Chat } from '@mui/icons-material';

import config from '@config/index';

import { actionAddChannel } from '@pages/ChatPage/actions';

import classes from '@components/MerchantInfo/style.module.scss';

const MerchantInfo = ({ merchant }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
        <h4 className={classes.merchantInfoHeader}>{merchant?.name}</h4>
        <span className={classes.profileInfo}>
          <p className={classes.profileLabel}>
            <FormattedMessage id="app_description" />
          </p>
          <p className={classes.profileText}>: {merchant?.description}</p>
        </span>
      </div>
      <IconButton
        className={classes.chatButton}
        onClick={() => dispatch(actionAddChannel(merchant?.userId, () => navigate('/chat')))}
      >
        <Chat />
      </IconButton>
    </div>
  );
};

MerchantInfo.propTypes = {
  merchant: PropTypes.object,
};

export default MerchantInfo;
