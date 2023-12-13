import PropTypes from 'prop-types';
import _ from 'lodash';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Avatar, Card, CardContent, CardMedia, IconButton, Skeleton } from '@mui/material';
import { Favorite } from '@mui/icons-material';

import config from '@config/index';

import { selectLogin, selectUser } from '@containers/Client/selectors';
import { actionAddToFavorit, actionDeleteFromFavorit } from '@pages/Favorit/action';

import classes from '@components/MerchantCard/style.module.scss';
import toast from 'react-hot-toast';
import intlHelper from '@utils/intlHelper';

const MerchantCard = ({ user, login, merchant }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const handleNavigate = () => {
    if (!login) navigate(`/login`);
    else if (user?.role === 'user') navigate(`/user/laundry/${merchant?.id}`);
    else toast.error(intlHelper({ message: 'app_must_user_role' }));
  };
  return (
    <div className={classes.cardWrap}>
      <Card className={classes.card} onClick={handleNavigate}>
        {merchant?.imagePath ? (
          <>
            {loading && <Skeleton variant="rectangular" height="194" width="100%" />}

            <CardMedia
              component="img"
              className={classes.img}
              image={`${config.api.server}${merchant?.imagePath}`}
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
        <CardContent>
          <h4 className={classes.headerText}>{merchant?.name}</h4>
          <p className={classes.desc}>{merchant?.description}</p>
        </CardContent>
      </Card>
      {login && user?.role === 'user' && (
        <div className={classes.cardAction}>
          {!_.find(merchant.Favorits, (val) => val?.userId === user?.id) ? (
            <IconButton onClick={() => dispatch(actionAddToFavorit(merchant?.id))}>
              <Favorite />
            </IconButton>
          ) : (
            <IconButton onClick={() => dispatch(actionDeleteFromFavorit(merchant?.id))}>
              <Favorite sx={{ color: 'red' }} />
            </IconButton>
          )}
        </div>
      )}
    </div>
  );
};

MerchantCard.propTypes = {
  merchant: PropTypes.object,
  user: PropTypes.object,
  login: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
  login: selectLogin,
});

export default connect(mapStateToProps)(MerchantCard);
