import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import MerchantCard from '@components/MerchantCard';
import NoData from '@components/NoData';

import { selectMerchants } from '@pages/Home/selectors';
import { actionGetMerchants, actionResetMerchants } from '@pages/Home/actions';

import classes from '@pages/Home/style.module.scss';

const Home = ({ merchants }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actionGetMerchants());
    return () => {
      if (merchants) {
        dispatch(actionResetMerchants());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <main className={classes.mainWrap}>
      <div className={classes.head}>
        <h2 className={classes.headerText}>
          <FormattedMessage id="app_tagline" />
        </h2>
        <img src="homePage.svg" className={classes.ilustration} alt="https://storyset.com" />
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

Home.propTypes = {
  merchants: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  merchants: selectMerchants,
});

export default connect(mapStateToProps)(Home);
