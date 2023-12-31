import PropTypes from 'prop-types';
import { divIcon } from 'leaflet';
import toast from 'react-hot-toast';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { createStructuredSelector } from 'reselect';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { renderToStaticMarkup } from 'react-dom/server';
import { Circle, MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet';

import config from '@config/index';

import MarkerLeaflet from '@components/MarkerLeaflet';

import { MyLocation } from '@mui/icons-material';
import { Avatar, IconButton } from '@mui/material';

import intlHelper from '@utils/intlHelper';

import { selectLogin, selectUser } from '@containers/Client/selectors';

import classes from '@components/MapLeaflet/style.module.scss';

const MapLeaflet = ({ handleLocation, islocated, permanent = true, merchants, login, user }) => {
  const navigate = useNavigate();
  const [markerloc, setMarkerloc] = useState(null);
  const [myLocation, setMyLocation] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setMyLocation({ lat: latitude, lng: longitude });
        setMarkerloc({ lat: latitude, lng: longitude });
        if (islocated) setMarkerloc(islocated);
        if (handleLocation) handleLocation({ lat: latitude, lng: longitude });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToMyLocation = () => {
    const map = mapRef.current;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setMyLocation({ lat: latitude, lng: longitude });
        map.setView({ lat: latitude, lng: longitude }, 17);
      });
    }
  };

  const handleNavigate = (merchant) => {
    if (!login) navigate(`/login`);
    else if (user?.role === 'user') navigate(`/user/laundry/${merchant?.id}`);
    else toast.error(intlHelper({ message: 'app_must_user_role' }));
  };

  const merchantMarker = (merchant) =>
    divIcon({
      html: renderToStaticMarkup(
        merchant?.imagePath ? (
          <Avatar className={classes.avatarMarker} src={`${config.api.server}${merchant?.imagePath}`} />
        ) : (
          <Avatar className={classes.avatarMarker}>
            <p>
              {merchant?.name?.split(' ')[0][0]}
              {merchant?.name?.split(' ').length > 1 && merchant?.name?.split(' ')[1][0]}
            </p>
          </Avatar>
        )
      ),
      iconSize: 0,
      iconAnchor: [20, 20],
      className: classes.marker,
    });

  return (
    <div className={classes.mapWrap} data-testid="map-wrap">
      {markerloc != null && (
        <MapContainer
          center={markerloc}
          zoom={!merchants ? 17 : 14}
          className={`${classes.mapContainer} ${merchants && classes.merchants}`}
          ref={mapRef}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {!merchants ? (
            <MarkerLeaflet positionProps={markerloc} handleLocation={handleLocation} permanent={permanent} />
          ) : (
            <>
              <MarkerClusterGroup chunkedLoading>
                {merchants?.map((merchant, key) => (
                  <Marker
                    icon={merchantMarker(merchant)}
                    key={key}
                    position={JSON.parse(merchant.location)}
                    data-testid="marker-click"
                    eventHandlers={{
                      click: () => {
                        handleNavigate(merchant);
                      },
                    }}
                  >
                    <Tooltip sticky>{merchant?.name}</Tooltip>
                  </Marker>
                ))}
              </MarkerClusterGroup>
              <Circle center={myLocation} radius={3000} />
            </>
          )}
          <Circle center={myLocation} pathOptions={{ fillColor: 'blue', color: 'blue' }} radius={10}>
            <Tooltip sticky>
              <FormattedMessage id="app_my_location" />
            </Tooltip>
          </Circle>
        </MapContainer>
      )}
      <IconButton
        onClick={handleToMyLocation}
        size="small"
        className={classes.myLocationButton}
        data-testid="button-position"
      >
        <MyLocation />
      </IconButton>
    </div>
  );
};

MapLeaflet.propTypes = {
  handleLocation: PropTypes.func,
  islocated: PropTypes.object,
  merchants: PropTypes.array,
  permanent: PropTypes.bool,
  login: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  login: selectLogin,
  user: selectUser,
});

export default connect(mapStateToProps)(MapLeaflet);
