import { render, fireEvent, act } from '@utils/testHelper';
import ForgotPassword from '@pages/ForgotPassword';

let wrapper;
const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
const mockLogin = false;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: jest.fn().mockImplementation(({ to, children }) => <a href={to}>{children}</a>),
}));
jest.mock('@containers/Client/selectors', () => ({
  selectLogin: () => mockLogin,
}));

beforeEach(() => {
  jest.clearAllMocks();
  act(() => {
    wrapper = render(<ForgotPassword />);
  });
});
describe('ForgotPassword Page', () => {
  test('Renders correctly', () => {
    const { getByText, getByLabelText, getByTestId } = wrapper;
    expect(getByLabelText('Email')).toBeInTheDocument();
    expect(getByTestId('button-submit')).toBeInTheDocument();
    expect(getByTestId('navigate-logo')).toBeInTheDocument();
    expect(getByText('Punya akun?')).toBeInTheDocument();
    expect(getByText('Masuk')).toBeInTheDocument();
  });

  test('Displays error message for invalid email', async () => {
    const { getByLabelText, getByTestId } = wrapper;
    const emailInput = getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    await act(() => {
      fireEvent.click(getByTestId('button-submit'));
    });
  });

  test('Submits form successfully and redirects to login', async () => {
    const { getByLabelText, getByTestId } = wrapper;
    const emailInput = getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'valid-email@example.com' } });
    await act(() => fireEvent.click(getByTestId('button-submit')));
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
  test('Submits form successfully and redirects to login', async () => {
    const { getByTestId } = wrapper;
    const logo = getByTestId('navigate-logo');
    act(() => {
      fireEvent.click(logo);
    });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
  test('Matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
