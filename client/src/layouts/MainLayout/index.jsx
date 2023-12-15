import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectLocale, selectTheme } from '@containers/App/selectors';
import { selectLogin, selectUser } from '@containers/Client/selectors';

import Navbar from '@components/Navbar';
import MobileNavbar from '@components/MobileNavbar';

const MainLayout = ({ user, login, children, locale, theme }) => (
  <div>
    <Navbar locale={locale} user={user} login={login} theme={theme} />
    {children}
    <MobileNavbar user={user} login={login} />
  </div>
);

const mapStateToProps = createStructuredSelector({
  locale: selectLocale,
  theme: selectTheme,
  user: selectUser,
  login: selectLogin,
});

MainLayout.propTypes = {
  children: PropTypes.element.isRequired,
  locale: PropTypes.string,
  theme: PropTypes.string,
  user: PropTypes.object,
  login: PropTypes.bool,
};

export default connect(mapStateToProps)(MainLayout);
