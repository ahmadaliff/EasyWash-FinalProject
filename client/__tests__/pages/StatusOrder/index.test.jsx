import StatusOrder from '@pages/StatusOrder';
import { render, fireEvent, act } from '@utils/testHelper';

let wrapper;
const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => jest.fn().mockReturnValue({ orderId: 2 }),
}));
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));
jest.mock('react-to-pdf', () => ({
  usePDF: () => jest.fn(),
}));
jest.mock('@components/MapRouting', () => jest.fn().mockImplementation(() => <div />));
jest.mock('@pages/StatusOrder/selectors', () => ({
  selectOrder: () => ({
    status: 'app_pending',
    id: 2,
    totalPrice: 2000,
    location: '{"lat": -6.224934545453234, "lng": 106.86266439802276 }',
    Services: [
      {
        name: 'reguler',
        isUnit: false,
        servicesOrdered: { price: 2000, quantity: 1 },
        Merchant: { location: '{"lat": -6.224934545453234, "lng": 106.86266439802276 }' },
      },
    ],
  }),
}));
jest.mock('@components/MapLeaflet', () => jest.fn().mockImplementation(() => <div />));

beforeEach(() => {
  act(() => {
    wrapper = render(<StatusOrder />);
  });
});

describe('Order Page', () => {
  test('render', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('status-order')).toBeInTheDocument();
  });
  test('navigate back when back button click', async () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-back');
    await act(async () => {
      fireEvent.click(button);
    });
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
  test('should be call func handle order', async () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-cancel');
    await act(async () => {
      fireEvent.click(button);
    });
    expect(mockDispatch).toHaveBeenCalled();
  });
  test('Matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
