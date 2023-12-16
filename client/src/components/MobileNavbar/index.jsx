import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import {
  DryCleaningOutlined,
  FavoriteBorder,
  LibraryBooksOutlined,
  LocalLaundryServiceOutlined,
  MessageOutlined,
  PersonOutline,
  ShoppingCartOutlined,
} from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';

import classes from '@components/MobileNavbar/style.module.scss';

const MobileNavbar = ({ login, user, intl: { formatMessage } }) => {
  const navigate = useNavigate();
  return (
    <div className={`${classes.MobileNavbar} ${!login && classes.hide}`}>
      <BottomNavigation showLabels>
        {user?.role === 'user' && (
          <BottomNavigationAction label="Favorit" icon={<FavoriteBorder />} onClick={() => navigate('/favorit')} />
        )}
        {user?.role === 'user' && (
          <BottomNavigationAction
            label={formatMessage({ id: 'app_cart_header' })}
            icon={<ShoppingCartOutlined />}
            onClick={() => navigate('/cart')}
          />
        )}
        {user?.role === 'merchant' && (
          <BottomNavigationAction
            label={formatMessage({ id: 'app_services_header' })}
            icon={<DryCleaningOutlined />}
            onClick={() => navigate('/service')}
          />
        )}
        {user?.role === 'merchant' && (
          <BottomNavigationAction
            label={formatMessage({ id: 'app_merchant_header' })}
            icon={<LocalLaundryServiceOutlined />}
            onClick={() => navigate('/laundry')}
          />
        )}

        {user?.role !== 'admin' && (
          <BottomNavigationAction
            label={formatMessage({ id: 'app_order_list' })}
            icon={<LibraryBooksOutlined />}
            onClick={() => {
              if (user?.role === 'user') navigate('/user/order');
              else navigate('/laundry/orders');
            }}
          />
        )}
        {user?.role !== 'admin' && (
          <BottomNavigationAction
            label={formatMessage({ id: 'app_chat' })}
            icon={<MessageOutlined />}
            onClick={() => navigate('/chat')}
          />
        )}
        {user?.role === 'admin' && (
          <BottomNavigationAction
            label={formatMessage({ id: 'app_user_page_header' })}
            icon={<PersonOutline />}
            onClick={() => navigate('/admin/user')}
          />
        )}
      </BottomNavigation>
    </div>
  );
};

MobileNavbar.propTypes = {
  login: PropTypes.bool,
  user: PropTypes.object,
  intl: PropTypes.object,
};
export default injectIntl(MobileNavbar);
