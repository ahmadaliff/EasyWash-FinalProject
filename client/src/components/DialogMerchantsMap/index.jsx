import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

import MapLeaflet from '@components/MapLeaflet';

const DialogMerchantsMap = ({ open, handleClose, merchants }) => (
  <Dialog open={open} onClose={handleClose} fullScreen>
    <DialogTitle fontSize="large">
      <b>
        <FormattedMessage id="app_map" />
      </b>
    </DialogTitle>
    <IconButton
      aria-label="close"
      onClick={handleClose}
      sx={{
        position: 'absolute',
        right: 8,
        top: 8,
      }}
    >
      <Close />
    </IconButton>
    <DialogContent>
      <MapLeaflet merchants={merchants} />
    </DialogContent>
  </Dialog>
);

DialogMerchantsMap.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  merchants: PropTypes.array,
};
export default DialogMerchantsMap;
