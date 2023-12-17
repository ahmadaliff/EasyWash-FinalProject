import PropTypes from 'prop-types';
import classNames from 'classnames';

import classes from './style.module.scss';

const Loader = ({ isLoading }) => (
  <div
    data-testid="Loading"
    className={classNames({
      [classes.loaderComponent]: true,
      [classes.showLoader]: isLoading || false,
    })}
  >
    <img src="/loader1.svg" alt="Loading" className={classes.img1} />
    <img src="/loader2.svg" alt="Loading" className={classes.img2} />
  </div>
);

Loader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
export default Loader;
