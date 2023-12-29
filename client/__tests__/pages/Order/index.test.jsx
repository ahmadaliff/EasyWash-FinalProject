import Order from '@pages/Order';
import { render, fireEvent, act } from '@utils/testHelper';

let wrapper;
const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));
jest.mock('@pages/Order/selectors', () => ({
  selectOrder: () => [{ serviceName: 'reguler', quantity: 2, servicePrice: 2000 }],
}));
jest.mock('@components/MapLeaflet', () => jest.fn().mockImplementation(() => <div />));

beforeEach(() => {
  act(() => {
    wrapper = render(<Order />);
  });
});

describe('Order Page', () => {
  test('render', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('order-page')).toBeInTheDocument();
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
    const button = getByTestId('button-order');
    await act(async () => {
      fireEvent.click(button);
    });
    expect(mockDispatch).toHaveBeenCalled();
  });
  test('Matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
