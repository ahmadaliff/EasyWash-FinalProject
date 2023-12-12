import { PropTypes } from 'prop-types';
import { Avatar, Card, CardContent, CardMedia, IconButton, Skeleton } from '@mui/material';
import classes from '@components/MerchantCard/style.module.scss';
import { Favorite } from '@mui/icons-material';
import { useState } from 'react';
import config from '@config/index';
import { createStructuredSelector } from 'reselect';
import { selectLogin, selectUser } from '@containers/Client/selectors';
import { connect, useDispatch } from 'react-redux';
import _ from 'lodash';
import { actionAddToFavorit, actionDeleteFromFavorit } from '@pages/Favorit/action';

const MerchantCard = ({ user, login, merchant }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  return (
    <div className={classes.cardWrap}>
      <Card className={classes.card}>
        {merchant?.imagePath ? (
          <>
            {loading && <Skeleton variant="rectangular" height="194" width="100%" />}

            <CardMedia
              component="img"
              height="194"
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
      {login && (
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
