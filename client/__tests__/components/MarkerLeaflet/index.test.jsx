import { render } from '@utils/testHelper';
import MarkerLeaflet from '@components/MarkerLeaflet';

let wrapper;
const mockHandleLocation = jest.fn();

jest.mock('react-leaflet', () => ({
  Popup: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
  Circle: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
  Marker: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
  useMapEvents: () => jest.fn(),
}));

const mockProps = {
  positionProps: { lat: 40.7128, lng: -74.006 },
  handleLocation: mockHandleLocation,
  permanent: false,
};

beforeEach(() => {
  wrapper = render(<MarkerLeaflet {...mockProps} />);
  jest.clearAllMocks();
});

describe('MarkerLeaflet Component', () => {
  test('Correct render', () => {
    const { getByText } = wrapper;
    expect(getByText('My location')).toBeInTheDocument();
  });

  test('Matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
