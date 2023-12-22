import MapLeaflet from '@components/MapLeaflet';
import { fireEvent, render } from '@utils/testHelper';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: () => jest.fn(() => ({ current: {} })),
}));

jest.mock('react-leaflet', () => ({
  Circle: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
  Marker: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
  Tooltip: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
  TileLayer: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
  MapContainer: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
  useMapEvents: () => jest.fn(),
}));

jest.mock('@react-leaflet/core', () => ({ createControlComponent: () => jest.fn() }));

jest.mock('react-dom/server', () => ({
  renderToStaticMarkup: jest.fn(),
}));

jest.mock('react-leaflet-cluster', () => jest.fn().mockImplementation(({ children }) => <div>{children}</div>));

jest.mock('@components/MarkerLeaflet', () => () => <div>MockMarker</div>);

const mockGeolocation = {
  getCurrentPosition: jest.fn().mockImplementationOnce((success) =>
    Promise.resolve(
      success({
        coords: {
          latitude: -6.224934545453234,
          longitude: 106.86266439802276,
        },
      })
    )
  ),
};
global.navigator.geolocation = mockGeolocation;

let wrapper;

const mockProps = {
  handleLocation: jest.fn(),
  isLocated: { lat: -6.224934545453234, lng: 106.86266439802276 },
  login: true,
  user: {
    fullName: 'ahmad alif sofian',
    role: 'user',
    imagePath: null,
  },
};

describe('Map Leaflet Component', () => {
  describe('map leaflet wihout merchants props', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      wrapper = render(<MapLeaflet {...mockProps} />);
      // eslint-disable-next-line no-console
      console.error.mockRestore();
    });
    test('Correct render', () => {
      const { getByTestId } = wrapper;
      expect(getByTestId('map-wrap')).toBeInTheDocument();
    });
    test('Correct render button to get current position', () => {
      const { getByTestId } = wrapper;
      expect(getByTestId('button-position')).toBeInTheDocument();
      const button = getByTestId('button-position');
      fireEvent.click(button);
    });
    test('Should match with snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
