import L, { divIcon } from 'leaflet';
import { createControlComponent } from '@react-leaflet/core';
import 'leaflet-routing-machine';
import classes from '@components/RoutingMachine/style.module.scss';
import 'leaflet-control-geocoder';
import { LocalLaundryService, Person } from '@mui/icons-material';
import { renderToStaticMarkup } from 'react-dom/server';

const iconPerson = divIcon({
  html: renderToStaticMarkup(<Person className={classes.iconMarker} />),
  iconSize: 0,
  iconAnchor: [20, 20],
  className: classes.marker,
});
const twoIcon = divIcon({
  html: renderToStaticMarkup(<LocalLaundryService className={classes.marker} />),
  iconSize: [0, 0],
});
const createRoutineMachineLayer = () => {
  const instance = L.Routing.control({
    waypoints: [L.latLng(-6.223710368739434, 106.84333920478822), L.latLng(-6.223614378310005, 106.84399902820589)],
    lineOptions: {
      styles: [
        { color: 'gray', opacity: 0.5, weight: 8 },
        { color: 'white', opacity: 1, weight: 4 },
        { color: 'green', opacity: 1, weight: 2 },
      ],
    },
    // show: false,
    addWaypoints: true,
    routeWhileDragging: true,
    draggableWaypoints: true,
    fitSelectedRoutes: true,
    showAlternatives: false,
    createMarker: (i, start, n) => {
      let markerIcon;
      let toolTip;
      if (i === 0) {
        markerIcon = iconPerson;
        toolTip = 'Your Location';
      } else if (i === n - 1) {
        markerIcon = twoIcon;
        toolTip = 'Laundry';
      }
      const marker = L.marker(start.latLng, {
        draggable: true,
        icon: markerIcon,
      }).bindTooltip(toolTip, {
        direction: 'top',
      });
      return marker;
    },
    geocoder: L.Control.Geocoder.nominatim(),
    pointMarkerStyle: { radius: 5, color: '#03f', fillColor: 'white', opacity: 1, fillOpacity: 0.7 },
    containerClassName: classes.container,
  });
  instance.on('routeselected', () => {
    // const coord = e.route.coordinates;
    // const instr = e.route.instructions;
  });
  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
