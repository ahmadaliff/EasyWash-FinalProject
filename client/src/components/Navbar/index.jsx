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
import { Button } from '@mui/material';
import {
  DryCleaningOutlined,
  FavoriteBorder,
  Language,
  LibraryBooksOutlined,
  LocalLaundryServiceOutlined,
  LogoutOutlined,
  MessageOutlined,
  PersonOutline,
  ShoppingCartOutlined,
} from '@mui/icons-material';

import DialogLanguage from '@components/DialogLanguage';
import NavbarIconButton from '@components/NavbarIconButton';

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
            <div className={classes.navButton}>
              {user?.role === 'user' && (
                <>
                  <NavbarIconButton title="Favorit" onClick={() => navigate('/favorit')} icon={<FavoriteBorder />} />
                  <NavbarIconButton
                    title={formatMessage({ id: 'app_cart_header' })}
                    onClick={() => navigate('/cart')}
                    icon={<ShoppingCartOutlined />}
                  />
                </>
              )}
              {user?.role === 'merchant' && (
                <>
                  <NavbarIconButton
                    title={formatMessage({ id: 'app_services_header' })}
                    onClick={() => navigate('/service')}
                    icon={<DryCleaningOutlined />}
                  />
                  <NavbarIconButton
                    title={formatMessage({ id: 'app_merchant_header' })}
                    onClick={() => navigate('/laundry')}
                    icon={<LocalLaundryServiceOutlined />}
                  />
                </>
              )}
              {user?.role !== 'admin' ? (
                <>
                  <NavbarIconButton
                    title={formatMessage({ id: 'app_order_list' })}
                    onClick={() => {
                      if (user?.role === 'user') navigate('/user/order');
                      else navigate('/laundry/orders');
                    }}
                    icon={<LibraryBooksOutlined />}
                  />
                  <NavbarIconButton
                    title={formatMessage({ id: 'app_chat' })}
                    onClick={() => navigate('/chat')}
                    icon={<MessageOutlined />}
                  />
                </>
              ) : (
                <NavbarIconButton
                  title={formatMessage({ id: 'app_user_page_header' })}
                  onClick={() => navigate('/admin/user')}
                  icon={<PersonOutline />}
                />
              )}
              <span className={classes.verticalLine} />
            </div>
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
