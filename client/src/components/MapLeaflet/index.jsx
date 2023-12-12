import { PropTypes } from 'prop-types';
import { Circle, MapContainer, TileLayer, Tooltip } from 'react-leaflet';
import { useCallback, useEffect, useState } from 'react';

import MarkerLeaflet from '@components/MarkerLeaflet';

import classes from '@components/MapLeaflet/style.module.scss';
import { IconButton } from '@mui/material';
import { MyLocation } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';

const MapLeaflet = ({ handleLocation, islocated, permanent = true }) => {
  const [markerloc, setMarkerloc] = useState(null);
  const [myLocation, setMyLocation] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setMyLocation({ lat: latitude, lng: longitude });
        setMarkerloc({ lat: latitude, lng: longitude });
        if (islocated) {
          setMarkerloc(islocated);
        }
        handleLocation({ lat: latitude, lng: longitude });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToMyLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setMyLocation({ lat: latitude, lng: longitude });
        map.setView({ lat: latitude, lng: longitude }, 17);
      });
    }
  }, [map]);

  return (
    <div className={classes.mapWrap}>
      {markerloc != null && (
        <MapContainer center={markerloc} zoom={17} className={classes.mapContainer} ref={setMap}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Circle center={myLocation} pathOptions={{ fillColor: 'blue', color: 'blue' }} radius={5}>
            <Tooltip sticky>
              <FormattedMessage id="app_my_location" />
            </Tooltip>
          </Circle>
          <MarkerLeaflet positionProps={markerloc} handleLocation={handleLocation} permanent={permanent} />
        </MapContainer>
      )}
      <IconButton onClick={handleToMyLocation} size="small" className={classes.myLocationButton}>
        <MyLocation />
      </IconButton>
    </div>
  );
};

MapLeaflet.propTypes = {
  handleLocation: PropTypes.func,
  islocated: PropTypes.object,
  permanent: PropTypes.bool,
};

export default MapLeaflet;
