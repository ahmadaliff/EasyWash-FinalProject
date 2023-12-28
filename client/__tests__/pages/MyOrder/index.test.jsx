import MyOrder from '@pages/MyOrder';
import { render, fireEvent, act } from '@utils/testHelper';

let wrapper;
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@pages/MyOrder/selectors', () => ({
  selectMyOrder: () => [
    {
      status: 'app_pickUp',
      userId: 1,
      totalRows: 1,
      id: 1,
      totalPrice: 20000,
    },
  ],
}));

beforeEach(() => {
  act(() => {
    wrapper = render(<MyOrder />);
  });
});

describe('My Order Page', () => {
  test('render', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('my-order')).toBeInTheDocument();
  });
  test('navigate back when back button click', async () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('back-button');
    await act(async () => {
      fireEvent.click(button);
    });
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
  test('shouldbe navigate to detail order', async () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-order-detail');
    act(() => {
      fireEvent.click(button);
    });
    expect(mockNavigate).toHaveBeenCalledWith('/user/order/status/1');
  });
  test('Matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
