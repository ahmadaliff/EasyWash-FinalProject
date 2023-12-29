import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import config from '@config/index';

import EditProfile from '@components/EditProfile';

import { Edit, FlipCameraIos } from '@mui/icons-material';
import { Avatar, Card, CardContent, Skeleton } from '@mui/material';

import { actionEditPhotoProfile, actionGetProfile, actionResetProfile } from '@pages/Profile/actions';
import { selectProfile } from '@pages/Profile/selectors';
import { selectUser } from '@containers/Client/selectors';

import classes from '@pages/Profile/style.module.scss';

const Profile = ({ user, profile }) => {
  const dispatch = useDispatch();
  const fileInput = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!profile) dispatch(actionGetProfile(user?.id));
    return () => {
      if (profile) {
        dispatch(actionResetProfile());
      }
    };
  }, [dispatch, profile, user?.id]);

  const handleImageChange = (e) => {
    dispatch(actionEditPhotoProfile(e.target.files[0]));
  };

  return (
    <main className={classes.mainWrap} data-testid="profile-page">
      <div className={classes.Wrap}>
        <input
          type="file"
          ref={fileInput}
          style={{ display: 'none' }}
          onChange={handleImageChange}
          accept="image/*"
          data-testid="input-image"
        />
        <Card>
          <CardContent className={classes.cardWrap}>
            <div
              className={classes.imgWrap}
              onClick={() => fileInput.current.click()}
              data-testid="button-change-image"
            >
              {profile?.imagePath ? (
                <>
                  {loading && <Skeleton variant="square" className={classes.skeleton} />}
                  <img
                    src={
                      profile?.imagePath.includes('https://lh3.googleusercontent.com/')
                        ? profile?.imagePath
                        : `${config.api.server}${profile?.imagePath}`
                    }
                    alt={profile?.fullName}
                    loading="lazy"
                    onLoad={() => setLoading(false)}
                  />
                </>
              ) : (
                <Avatar className={classes.avatar} variant="square">
                  {profile?.fullName?.split(' ')[0][0]}
                  {profile?.fullName?.split(' ').length > 1 && profile?.fullName?.split(' ')[1][0]}
                </Avatar>
              )}
              <Edit className={classes.buttonEdit} />
              <FlipCameraIos className={classes.iconCamera} />
            </div>
            <button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className={classes.buttonEditProfile}
              data-testid="button-edit"
            >
              <FormattedMessage id="app_profile_edit" />
            </button>
          </CardContent>
        </Card>
        <div>
          <h3>
            <FormattedMessage id="app_profile" />
          </h3>
          <span className={classes.profileInfo}>
            <p className={classes.profileLabel}>
              <FormattedMessage id="app_user_fullName" />
            </p>
            <p className={classes.profileText}>{profile?.fullName}</p>
          </span>
          <span className={classes.profileInfo}>
            <p className={classes.profileLabel}>
              <FormattedMessage id="app_user_phone" />
            </p>
            <p className={classes.profileText}>{profile?.phone || '-'}</p>
          </span>
          <span className={classes.profileInfo}>
            <p className={classes.profileLabel}>
              <FormattedMessage id="app_user_email" />
            </p>
            <p className={classes.profileText}>{profile?.email}</p>
          </span>
          <span className={classes.profileInfo}>
            <p className={classes.profileLabel}>
              <FormattedMessage id="app_account_type" />
            </p>
            <p className={classes.profileText}>{profile?.role}</p>
          </span>
        </div>
      </div>
      <EditProfile profile={profile} open={isDialogOpen} handleClose={() => setIsDialogOpen(false)} />
    </main>
  );
};

Profile.propTypes = {
  user: PropTypes.object,
  profile: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
  profile: selectProfile,
});

export default connect(mapStateToProps)(Profile);
