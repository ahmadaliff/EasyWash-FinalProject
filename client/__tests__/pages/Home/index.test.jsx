import { render, fireEvent } from '@utils/testHelper';
import Home from '@pages/Home';

let wrapper;
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock('@pages/Home/selectors', () => ({
  selectMerchants: () => [
    {
      name: 'merchant',
      imagePath: null,
      distance: 5,
      description: 'description merchant',
      Favorits: [],
      userId: 2,
    },
  ],
}));

jest.mock('@components/DialogMerchantsMap', () =>
  jest.fn().mockImplementation(() => <div data-testid="dialog-merchants-map" />)
);

beforeEach(() => {
  wrapper = render(<Home />);
});

describe('Home Page', () => {
  test('renders', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('home-wrap')).toBeInTheDocument();
  });

  test('handles search input', () => {
    const { getByTestId } = wrapper;
    const searchInput = getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'search value' } });
    expect(searchInput.value).toBe('search value');
  });

  test('opens DialogMerchantsMap on map icon click', () => {
    const { getByTestId } = wrapper;
    fireEvent.click(getByTestId('dialog-merchants-map'));
  });
  test('Matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
