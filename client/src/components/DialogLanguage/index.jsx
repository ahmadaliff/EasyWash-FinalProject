import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Close } from '@mui/icons-material';
import { Avatar, Dialog, DialogContent, DialogTitle, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import styled from 'styled-components';

import classes from '@components/DialogLanguage/style.module.scss';

const StyledToggleLanguage = styled(ToggleButton)({
  '&.Mui-selected, &.Mui-selected:hover': {
    color: 'white',
    backgroundColor: '#7ac94c',
    border: 'none',
  },
});

const DialogLanguage = ({ handleSelectLang, locale, open, handleClose }) => (
  <Dialog open={open} onClose={handleClose} fullWidth>
    <DialogTitle fontSize="large">
      <b>
        <FormattedMessage id="app_select_language" />
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
      <ToggleButtonGroup
        value={locale}
        exclusive
        onChange={handleSelectLang}
        fullWidth
        className={classes.toggleRole}
        size="small"
      >
        <StyledToggleLanguage value="id">
          <Avatar src="/id.png" variant="square" />
          <FormattedMessage id="app_lang_id" />
        </StyledToggleLanguage>
        <StyledToggleLanguage value="en">
          <Avatar src="/en.png" variant="square" />
          <FormattedMessage id="app_lang_en" />
        </StyledToggleLanguage>
      </ToggleButtonGroup>
    </DialogContent>
  </Dialog>
);

DialogLanguage.propTypes = {
  handleSelectLang: PropTypes.func,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  locale: PropTypes.string.isRequired,
};
export default DialogLanguage;
