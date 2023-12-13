import PropTypes from 'prop-types';
import { useState } from 'react';
import { Marker, Circle, useMapEvents, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-control-geocoder';

import classes from '@components/MarkerLeaflet/style.module.scss';

const MarkerLeaflet = ({ positionProps, handleLocation, permanent }) => {
  const [position, setPosition] = useState(positionProps);
  const [locationName, setLocationName] = useState('My location');
  const geocoder = L.Control.Geocoder.nominatim();
  const map = useMapEvents({
    click(e) {
      if (!permanent) {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng });
        handleLocation({ lat, lng });
        map.flyTo(e.latlng, map.getZoom());
        geocoder.reverse(e.latlng, map.options.crs.scale(map.getZoom()), (results) => {
          setLocationName(results[0].name);
        });
      }
    },
  });

  return position === null ? null : (
    <div>
      <Circle center={position} radius={2} color="red" />
      <Marker position={position}>
        <Popup className={classes.popUp}>{locationName}</Popup>
      </Marker>
    </div>
  );
};

MarkerLeaflet.propTypes = {
  positionProps: PropTypes.object,
  handleLocation: PropTypes.func,
  permanent: PropTypes.bool,
};
export default MarkerLeaflet;
