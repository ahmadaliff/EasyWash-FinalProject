import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import logo from '@static/images/notfound.svg';

import classes from './style.module.scss';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className={classes.contentWrapper}>
      <img className={classes.image} src={logo} alt="Not Found" />
      <a href="https://storyset.com/web" className={classes.storySet}>
        Web illustrations by Storyset
      </a>
      <div className={classes.title}>
        <FormattedMessage id="app_not_found" />
      </div>
      <div className={classes.desc}>
        <FormattedMessage id="app_not_found_desc" />
      </div>
      <button className={classes.backButton} type="button" onClick={() => navigate('/')}>
        <FormattedMessage id="app_back_to_home" />
      </button>
    </div>
  );
};

export default NotFound;
