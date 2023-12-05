import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

const intlHelper = ({ message, intl: { formatMessage } }) => formatMessage({ id: message });

intlHelper.propTypes = {
  message: PropTypes.string,
  intl: PropTypes.object,
};

export default injectIntl(intlHelper);
