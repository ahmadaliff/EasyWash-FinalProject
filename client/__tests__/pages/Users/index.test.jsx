import Users from '@pages/Users';
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

jest.mock('@components/MapLeaflet', () => jest.fn().mockImplementation(() => <div />));

jest.mock('@pages/Users/selectors', () => ({
  selectUsers: () => ({
    data: [
      {
        status: 'app_pickUp',
        userId: 1,
        totalRows: 1,
        id: 1,
        totalPrice: 20000,
      },
    ],
    totalRows: 1,
  }),
}));

jest.mock('@components/DetailOrder', () => jest.fn().mockImplementation(() => <p data-testid="dialog-detail-order" />));

beforeEach(() => {
  act(() => {
    wrapper = render(<Users />);
  });
});

describe('Users Page', () => {
  test('render', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('users-page')).toBeInTheDocument();
  });
  test('navigate back when back button click', async () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('back-button');
    await act(async () => {
      fireEvent.click(button);
    });
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
  test('change tab users unverified', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-unverified-user');
    act(() => {
      fireEvent.click(button);
    });
    expect(mockDispatch).toHaveBeenCalled();
  });
  test('shouldbe clicked buttton verify', async () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-unverified-user');
    act(() => {
      fireEvent.click(button);
    });
    const buttonVerify = getByTestId('button-verify');
    await act(async () => {
      fireEvent.click(buttonVerify);
    });
  });
  test('shouldbe clicked buttton decline', async () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-unverified-user');
    act(() => {
      fireEvent.click(button);
    });
    const buttonDecline = getByTestId('button-decline');
    await act(async () => {
      fireEvent.click(buttonDecline);
    });
  });
  test('change tab users verified', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-verified-users');
    fireEvent.click(button);
    expect(mockDispatch).toHaveBeenCalled();
  });
  test('shouldbe clicked buttton delete', async () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-delete');
    await act(async () => {
      fireEvent.click(button);
    });
  });
  test('Matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
