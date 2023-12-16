import PropTypes from 'prop-types';

import { IconButton, Tooltip } from '@mui/material';

const NavbarIconButton = ({ title, icon, onClick }) => (
  <Tooltip title={title} arrow>
    <IconButton color="inherit" onClick={onClick}>
      {icon}
    </IconButton>
  </Tooltip>
);

NavbarIconButton.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.element.isRequired,
};
export default NavbarIconButton;
