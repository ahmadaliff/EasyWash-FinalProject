import { MapContainer, TileLayer } from 'react-leaflet';
import RoutineMachine from '@components/RoutingMachine/index';
import classes from '@pages/Map/style.module.scss';

const Map = () => {
  return (
    <MapContainer
      doubleClickZoom={false}
      id="mapId"
      zoom={14}
      center={[-6.223710368739434, 106.84333920478822]}
      className={classes.map}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <RoutineMachine />
    </MapContainer>
  );
};

export default Map;
