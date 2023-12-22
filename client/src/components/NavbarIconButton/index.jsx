import PropTypes from 'prop-types';

import { IconButton, Tooltip } from '@mui/material';

const NavbarIconButton = ({ title, icon, onClick, testId }) => (
  <Tooltip title={title} arrow>
    <IconButton color="inherit" data-testid={testId} onClick={onClick}>
      {icon}
    </IconButton>
  </Tooltip>
);

NavbarIconButton.propTypes = {
  testId: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.element.isRequired,
};
export default NavbarIconButton;
