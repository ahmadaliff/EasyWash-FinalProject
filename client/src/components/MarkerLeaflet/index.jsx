import { PropTypes } from 'prop-types';
import { useState } from 'react';
import { Marker, Circle, useMapEvents } from 'react-leaflet';

const MarkerLeaflet = ({ positionProps, handleLocation }) => {
  const [position, setPosition] = useState(positionProps);
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      handleLocation({ lat, lng });
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <div>
      <Circle center={position} radius={2} color="red" />
      <Marker position={position} draggable />
    </div>
  );
};

MarkerLeaflet.propTypes = {
  positionProps: PropTypes.object,
  handleLocation: PropTypes.func,
};
export default MarkerLeaflet;
