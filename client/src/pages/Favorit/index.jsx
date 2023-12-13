import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useEffect } from 'react';

import MerchantCard from '@components/MerchantCard';
import NoData from '@components/NoData';

import { Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

import { actionGetFavoritMerchants, actionResetFavoritMerchants } from '@pages/Favorit/action';
import { selectMerchants } from '@pages/Favorit/selectors';

import classes from '@pages/Favorit/style.module.scss';

const Favorit = ({ merchants }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(actionGetFavoritMerchants());
    return () => {
      if (merchants) {
        dispatch(actionResetFavoritMerchants());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  return (
    <main className={classes.mainWrap}>
      <div className={classes.head}>
        <h3>Favorit</h3>
        <Button
          variant="contained"
          className={classes.backButton}
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
        >
          <FormattedMessage id="app_back" />
        </Button>
      </div>
      <div className={classes.content}>
        {merchants?.map((val, key) => (
          <MerchantCard merchant={val} key={key} />
        ))}
      </div>

      {merchants?.length === 0 && <NoData />}
    </main>
  );
};

Favorit.propTypes = {
  merchants: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  merchants: selectMerchants,
});

export default connect(mapStateToProps)(Favorit);
