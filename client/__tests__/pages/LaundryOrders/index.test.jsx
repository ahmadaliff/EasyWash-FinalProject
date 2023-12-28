import LaundryOrders from '@pages/LaundryOrders';
import { render, fireEvent, act } from '@utils/testHelper';

let wrapper;
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@pages/LaundryOrders/selectors', () => ({
  selectOrders: () => ({
    data: [
      {
        status: 'app_pickUp',
        userId: 1,
        totalRows: 1,
        id: 1,
        totalPrice: 20000,
      },
    ],
  }),
}));

jest.mock('@components/DetailOrder', () => jest.fn().mockImplementation(() => <p data-testid="dialog-detail-order" />));

beforeEach(() => {
  act(() => {
    wrapper = render(<LaundryOrders />);
  });
});

describe('Laundry Orders Page', () => {
  test('render', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('laundry-orders')).toBeInTheDocument();
  });
  test('navigate back when back button click', async () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('back-button');
    await act(async () => {
      fireEvent.click(button);
    });
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
  test('open dialog when button click', async () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-dialog');
    act(() => {
      fireEvent.click(button);
    });
    expect(getByTestId('dialog-detail-order')).toBeInTheDocument();
  });
  test('Matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
