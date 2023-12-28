import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import {
  DryCleaningOutlined,
  FavoriteBorder,
  LayersClear,
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
    <div className={`${classes.MobileNavbar} ${!login && classes.hide}`} data-testid="navbar">
      <BottomNavigation showLabels>
        {user?.role === 'user' && (
          <BottomNavigationAction
            label="Favorit"
            icon={<FavoriteBorder />}
            onClick={() => navigate('/favorit')}
            data-testid="button-favorit"
          />
        )}
        {user?.role === 'user' && (
          <BottomNavigationAction
            label={formatMessage({ id: 'app_cart_header' })}
            icon={<ShoppingCartOutlined />}
            onClick={() => navigate('/cart')}
            data-testid="button-cart"
          />
        )}
        {user?.role === 'merchant' && (
          <BottomNavigationAction
            label={formatMessage({ id: 'app_services_header' })}
            icon={<DryCleaningOutlined />}
            onClick={() => navigate('/service')}
            data-testid="button-service"
          />
        )}
        {user?.role === 'merchant' && (
          <BottomNavigationAction
            label={formatMessage({ id: 'app_merchant_header' })}
            icon={<LocalLaundryServiceOutlined />}
            onClick={() => navigate('/laundry')}
            data-testid="button-laundry"
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
            data-testid="button-order"
          />
        )}
        {user?.role !== 'admin' && (
          <BottomNavigationAction
            label={formatMessage({ id: 'app_chat' })}
            icon={<MessageOutlined />}
            onClick={() => navigate('/chat')}
            data-testid="button-chat"
          />
        )}
        {user?.role === 'admin' && (
          <BottomNavigationAction
            label={formatMessage({ id: 'app_user_page_header' })}
            icon={<PersonOutline />}
            onClick={() => navigate('/admin/user')}
            data-testid="button-admin"
          />
        )}
        {user?.role === 'admin' && (
          <BottomNavigationAction
            label={formatMessage({ id: 'app_deletedMerchants_header' })}
            icon={<LayersClear />}
            onClick={() => navigate('/admin/deletedMerchant')}
            data-testid="button-deletedMerchant"
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
