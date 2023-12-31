import PropTypes from 'prop-types';

import MapLeaflet from '@components/MapLeaflet';
import MerchantInfo from '@components/MerchantInfo';

import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';

const DialogMerchantInfo = ({ handleClose, open, merchant }) => (
  <Dialog open={open} onClose={handleClose} fullWidth>
    <DialogActions>
      <Button onClick={handleClose}>X</Button>
    </DialogActions>
    <DialogContent>
      <MerchantInfo merchant={merchant} chat={false} />
      <br />
      <MapLeaflet islocated={merchant && JSON.parse(merchant?.location)} />
    </DialogContent>
  </Dialog>
);

DialogMerchantInfo.propTypes = {
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  merchant: PropTypes.object,
};

export default DialogMerchantInfo;
