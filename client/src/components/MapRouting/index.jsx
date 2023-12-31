import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { MapContainer, TileLayer } from 'react-leaflet';

import RoutineMachine from '@components/RoutingMachine/index';

import { selectUser } from '@containers/Client/selectors';

import classes from '@components/MapRouting/style.module.scss';

const MapRouting = ({ laundryPoint, userPoint, user }) => (
  <MapContainer
    doubleClickZoom={false}
    id="mapId"
    zoom={14}
    center={user?.role === 'merchant' ? laundryPoint : userPoint}
    className={classes.map}
  >
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <RoutineMachine userPoint={userPoint} laundryPoint={laundryPoint} />
  </MapContainer>
);

MapRouting.propTypes = {
  user: PropTypes.object,
  laundryPoint: PropTypes.object,
  userPoint: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
});

export default connect(mapStateToProps)(MapRouting);
