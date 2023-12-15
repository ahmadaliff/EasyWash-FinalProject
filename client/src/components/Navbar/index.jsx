import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import { Button, IconButton, Tooltip } from '@mui/material';
import {
  FavoriteBorder,
  Language,
  LibraryBooksOutlined,
  LogoutOutlined,
  MessageOutlined,
  PersonOutline,
  ShoppingCartOutlined,
} from '@mui/icons-material';

import DialogLanguage from '@components/DialogLanguage';

import config from '@config/index';

import { setLocale, setTheme } from '@containers/App/actions';
import { actionHandleLogout } from '@containers/Client/actions';

import classes from './style.module.scss';

const Navbar = ({ locale, theme, user, login, intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openDialogLanguage, setOpenDialogLanguage] = useState(false);
  const [profilePosition, setProfilePosition] = useState(null);
  const openProfil = Boolean(profilePosition);

  const handleProfilClick = (event) => {
    setProfilePosition(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfilePosition(null);
  };

  const handleTheme = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
  };

  const onSelectLang = (e, lang) => {
    if (lang !== locale) {
      dispatch(setLocale(lang));
    }
    handleProfileClose();
    setOpenDialogLanguage(false);
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className={classes.headerWrapper} data-testid="navbar">
      <div className={classes.contentWrapper}>
        <div className={classes.logoImage} onClick={goHome}>
          <img src="/longLogo.svg" alt="logo" className={classes.logo} />
        </div>
        <div className={classes.toolbar}>
          {login && (
            <>
              <div className={classes.navButton}>
                {user?.role === 'user' && (
                  <>
                    <Tooltip title="Favorit" arrow>
                      <IconButton color="inherit" onClick={() => navigate('/favorit')}>
                        <FavoriteBorder />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={formatMessage({ id: 'app_cart_header' })} arrow>
                      <IconButton color="inherit" onClick={() => navigate('/cart')}>
                        <ShoppingCartOutlined />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
                {user?.role !== 'admin' ? (
                  <>
                    <Tooltip title={formatMessage({ id: 'app_order_list' })} arrow>
                      <IconButton
                        color="inherit"
                        onClick={() => {
                          if (user?.role === 'user') navigate('/user/order');
                          else navigate('/laundry/orders');
                        }}
                      >
                        <LibraryBooksOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={formatMessage({ id: 'app_chat' })} arrow>
                      <IconButton color="inherit" onClick={() => navigate('/chat')}>
                        <MessageOutlined />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <Tooltip title={formatMessage({ id: 'app_user_page_header' })} arrow>
                    <IconButton color="inherit" onClick={() => navigate('/admin/user')}>
                      <PersonOutline />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
              <span className={classes.verticalLine} />
            </>
          )}
          <div className={classes.toggle} onClick={handleProfilClick}>
            {login ? (
              <>
                {user?.imagePath ? (
                  <Avatar className={classes.avatar} src={`${config.api.server}${user?.imagePath}`} />
                ) : (
                  <Avatar className={classes.avatar}>
                    <p>
                      {user?.fullName?.split(' ')[0][0]}{' '}
                      {user?.fullName?.split(' ').length > 1 && user?.fullName?.split(' ')[1][0]}
                    </p>
                  </Avatar>
                )}
                <div className={classes.name}>{user?.fullName}</div>
              </>
            ) : (
              <Avatar className={classes.avatar} />
            )}
            <ExpandMoreIcon className={classes.arrow} />
          </div>
        </div>
        <Menu open={openProfil} anchorEl={profilePosition} onClose={handleProfileClose} className={classes.menu}>
          {login ? (
            <div>
              {user?.role === 'merchant' && (
                <div>
                  <MenuItem className={classes.menuItem}>test</MenuItem>
                </div>
              )}
              <MenuItem className={classes.menuItem} onClick={() => navigate('/profile')}>
                <Avatar className={classes.avatarMenuItem} />
                <FormattedMessage id="app_profile" />
              </MenuItem>
              <MenuItem className={classes.menuItem} onClick={() => dispatch(actionHandleLogout())}>
                <LogoutOutlined />
                <FormattedMessage id="app_header_logout" />
              </MenuItem>
            </div>
          ) : (
            <MenuItem className={classes.menuItem}>
              <Button
                variant="contained"
                className={classes.menuItemButtonContained}
                onClick={() => navigate('/login')}
              >
                <FormattedMessage id="app_header_login" />
              </Button>
              <Button
                variant="outlined"
                className={classes.menuItemButtonOutlined}
                onClick={() => navigate('/register')}
              >
                <FormattedMessage id="app_header_register" />
              </Button>
            </MenuItem>
          )}
          <hr />
          <MenuItem onClick={() => setOpenDialogLanguage(true)} className={classes.menuItem}>
            <Language />
            <p>
              <FormattedMessage id="app_select_language" />
            </p>
          </MenuItem>
          <MenuItem onClick={handleTheme} className={`${classes.menuItem} ${classes.theme}`} data-testid="toggleTheme">
            {theme === 'light' ? <NightsStayIcon /> : <LightModeIcon />}
            <p>{theme}</p>
          </MenuItem>
        </Menu>
        <DialogLanguage
          handleSelectLang={onSelectLang}
          handleClose={() => setOpenDialogLanguage(false)}
          open={openDialogLanguage}
          locale={locale}
        />
      </div>
    </div>
  );
};

Navbar.propTypes = {
  locale: PropTypes.string.isRequired,
  theme: PropTypes.string,
  user: PropTypes.object,
  intl: PropTypes.object,
  login: PropTypes.bool,
};

export default injectIntl(Navbar);
