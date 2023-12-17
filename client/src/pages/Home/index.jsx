import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import MerchantCard from '@components/MerchantCard';
import NoData from '@components/NoData';

import { Map, Search } from '@mui/icons-material';

import { selectMerchants } from '@pages/Home/selectors';
import { actionGetMerchants, actionResetMerchants } from '@pages/Home/actions';

import classes from '@pages/Home/style.module.scss';
import { IconButton } from '@mui/material';
import DialogMerchantsMap from '@components/DialogMerchantsMap';

const Home = ({ merchants }) => {
  const dispatch = useDispatch();
  const [filterSearch, setFilterSearch] = useState('');
  const [isMapOpen, setIsMapOpen] = useState(false);
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
      <header className={classes.head}>
        <div className={classes.headerText}>
          <h2>
            <FormattedMessage id="app_tagline" />
          </h2>
          <div className={classes.searchInputWrap}>
            <Search className={classes.iconSearch} />
            <input className={classes.searchInput} onChange={(e) => setFilterSearch(e.target.value)} />
            <IconButton color="inherit" onClick={() => setIsMapOpen(true)}>
              <Map />
            </IconButton>
          </div>
        </div>
        <div className={classes.ilustrationWrap}>
          <img src="homePage.svg" className={classes.ilustration} alt="https://storyset.com" />
          <a href="https://storyset.com/web" className={classes.storySet}>
            Web illustrations by Storyset
          </a>
        </div>
      </header>
      <header className={classes.secondHeader}>
        <h3>
          <FormattedMessage id="app_looking_for_laundry" />
        </h3>
        <p>
          <FormattedMessage id="app_second_header_description" />
        </p>
      </header>
      <div className={classes.content}>
        {merchants
          ?.filter(({ name }) => name.toLowerCase().includes(filterSearch.toLowerCase()))
          .map((val, key) => (
            <MerchantCard merchant={val} key={key} />
          ))}
      </div>
      {merchants?.filter(({ name }) => name.toLowerCase().includes(filterSearch.toLowerCase()))?.length === 0 && (
        <NoData />
      )}
      <DialogMerchantsMap merchants={merchants} open={isMapOpen} handleClose={() => setIsMapOpen(false)} />
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
