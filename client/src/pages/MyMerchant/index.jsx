import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useEffect, useRef, useState } from 'react';

import config from '@config/index';

import { Avatar, Button, Card, CardContent, Skeleton } from '@mui/material';
import { ArrowBack, Edit, FlipCameraIos } from '@mui/icons-material';

import EditMerchant from '@components/EditMerchant';

import { selectMerchant } from '@pages/MyMerchant/selectors';
import { actionEditPhotoMerchant, actionGetMerchant, actionResetMerchant } from '@pages/MyMerchant/actions';

import classes from '@pages/MyMerchant/style.module.scss';

const MyMerchant = ({ merchant }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputMerchant = useRef(null);
  const [loading, setLoading] = useState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(actionGetMerchant());
    return () => {
      if (merchant) {
        dispatch(actionResetMerchant());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleImageChange = (e) => {
    dispatch(actionEditPhotoMerchant(e.target.files[0]));
  };
  return (
    <main className={classes.mainWrap}>
      <div className={classes.header}>
        <Button
          variant="contained"
          className={classes.backButton}
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
        >
          <FormattedMessage id="app_back" />
        </Button>
      </div>
      <Card className={classes.Wrap}>
        <CardContent className={classes.cardWrap}>
          <input
            type="file"
            ref={fileInputMerchant}
            style={{ display: 'none' }}
            onChange={handleImageChange}
            accept="image/*"
          />
          <div className={classes.imgWrap} onClick={() => fileInputMerchant.current.click()}>
            {merchant?.imagePath ? (
              <>
                {loading && <Skeleton variant="square" className={classes.skeleton} />}
                <img
                  src={`${config.api.server}${merchant?.imagePath}`}
                  alt={merchant?.fullName}
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
            <Edit className={classes.buttonEdit} />
            <FlipCameraIos className={classes.iconCamera} />
          </div>
          <EditMerchant merchant={merchant} open={isDialogOpen} handleClose={() => setIsDialogOpen(false)} />
          <div>
            <h4>
              <FormattedMessage id="app_merchant_header" />
            </h4>
            <span className={classes.profileInfo}>
              <p className={classes.profileLabel}>
                <FormattedMessage id="app_merchant_name" />
              </p>
              <p className={classes.profileText}>: {merchant?.name}</p>
            </span>
            <span className={classes.profileInfo}>
              <p className={classes.profileLabel}>
                <FormattedMessage id="app_description" />
              </p>
              <p className={classes.profileText}>: {merchant?.description}</p>
            </span>
            <button type="button" onClick={() => setIsDialogOpen(true)} className={classes.buttonEditProfile}>
              <FormattedMessage id="app_edit" />
            </button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

MyMerchant.propTypes = {
  merchant: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  merchant: selectMerchant,
});

export default connect(mapStateToProps)(MyMerchant);
