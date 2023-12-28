import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import MapLeaflet from '@components/MapLeaflet';
import MerchantInfo from '@components/MerchantInfo';

import { Button, Dialog, DialogActions, DialogContent, IconButton } from '@mui/material';
import { ArrowBack, ArrowRight, Search } from '@mui/icons-material';

import { actionGetDeletedMerchants, actionResetDeletedMerchants } from '@pages/DeletedMerchant/action';
import { selectMerchants } from '@pages/DeletedMerchant/selectors';

import classes from '@pages/DeletedMerchant/style.module.scss';

const DeletedMerchant = ({ deletedMerchants }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [merchantDialog, setMerchant] = useState(null);
  const [filterSearch, setFilterSearch] = useState('');

  useEffect(() => {
    if (!deletedMerchants) {
      dispatch(actionGetDeletedMerchants());
    }
    return () => {
      if (deletedMerchants) dispatch(actionResetDeletedMerchants());
    };
  }, [deletedMerchants, dispatch]);

  return (
    <main className={classes.mainWrap}>
      <div className={classes.header}>
        <h3>
          <FormattedMessage id="app_deletedMerchants_header" />
        </h3>
        <div className={classes.searchInputWrap}>
          <Search className={classes.iconSearch} />
          <input
            className={classes.searchInput}
            onChange={(e) => setFilterSearch(e.target.value)}
            data-testid="search-input"
          />
        </div>
        <Button
          variant="contained"
          className={classes.backButton}
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
        >
          <FormattedMessage id="app_back" />
        </Button>
      </div>

      {deletedMerchants
        ?.filter(({ name }) => name.toLowerCase().includes(filterSearch.toLowerCase()))
        ?.map((merchant, key) => (
          <div key={key} className={classes.merchantCard}>
            <MerchantInfo merchant={merchant} chat={false} />
            <IconButton
              onClick={() => {
                setMerchant(merchant);
                setDialogOpen(true);
              }}
            >
              <ArrowRight />
            </IconButton>
          </div>
        ))}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>X</Button>
        </DialogActions>
        <DialogContent>
          <MerchantInfo merchant={merchantDialog} chat={false} />
          <br />
          <MapLeaflet islocated={merchantDialog && JSON.parse(merchantDialog?.location)} />
        </DialogContent>
      </Dialog>
    </main>
  );
};

DeletedMerchant.propTypes = {
  deletedMerchants: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  deletedMerchants: selectMerchants,
});
export default connect(mapStateToProps)(DeletedMerchant);
