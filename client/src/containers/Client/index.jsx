import PropTypes from 'prop-types';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import { selectLogin, selectUser } from '@containers/Client/selectors';
import intlHelper from '@utils/intlHelper';

const Client = ({ login, role, user, children }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!login) {
      navigate('/login');
    } else if (role && role !== user?.role) {
      toast.error(intlHelper({ message: '' }));
      navigate('/');
    }
  }, [login, role, navigate, user?.role]);

  return children;
};

Client.propTypes = {
  login: PropTypes.bool,
  user: PropTypes.object,
  children: PropTypes.element,
};

const mapStateToProps = createStructuredSelector({
  login: selectLogin,
  user: selectUser,
});

export default connect(mapStateToProps)(Client);
