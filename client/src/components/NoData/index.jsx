import { FormattedMessage } from 'react-intl';

import classes from '@components/NoData/style.module.scss';

const NoData = () => (
  <div className={classes.noData} data-testid="no-data">
    <FormattedMessage id="app_no_data_to_show" />
  </div>
);

export default NoData;
