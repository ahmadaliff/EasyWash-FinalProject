import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import intlHelper from '@utils/intlHelper';

import { actionHandleLoginGoogle } from '@containers/Client/actions';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  const code = searchParams.get('code');
  useEffect(() => {
    if (error) {
      navigate('/login');
      toast(intlHelper({ message: 'app_login_failed' }));
    }
    if (code) {
      dispatch(
        actionHandleLoginGoogle(code, () => {
          setTimeout(() => {
            navigate('/');
          }, 1000);
        })
      );
    }
  }, [error, code, navigate, dispatch]);
};

export default GoogleCallback;
