import Register from '@pages/Register';
import { render, fireEvent, act } from '@utils/testHelper';

let wrapper;
let mockStep = 0;
let mockLogin = false;
const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: () => <b />,
}));
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));
jest.mock('@containers/Client/selectors', () => ({
  selectLogin: () => mockLogin,
}));
jest.mock('@pages/Register/selectors', () => ({
  selectStep: () => mockStep,
}));

jest.mock('@components/MapLeaflet', () => jest.fn().mockImplementation(() => <div />));
jest.mock('@components/VerifyEmail', () => jest.fn().mockImplementation(() => <div data-testid="verify-comp" />));
jest.mock('@components/VerifyEmailOTP', () =>
  jest.fn().mockImplementation(() => <div data-testid="verify-otp-comp" />)
);
jest.mock('@components/RegisterRole', () =>
  jest.fn().mockImplementation(() => <div data-testid="register-role-comp" />)
);
jest.mock('@components/RegisterForm', () =>
  jest.fn().mockImplementation(() => <div data-testid="register-form-comp" />)
);

describe('Register Page', () => {
  test('render', () => {
    const { getByTestId } = render(<Register />);
    expect(getByTestId('register-page')).toBeInTheDocument();
  });
  test('navigate home when logo click', async () => {
    const { getByTestId } = render(<Register />);
    const button = getByTestId('logo');
    await act(async () => {
      fireEvent.click(button);
    });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
  describe('step 0', () => {
    test('should render comp verify email', async () => {
      const { getByTestId } = render(<Register />);
      expect(getByTestId('verify-comp')).toBeInTheDocument();
    });
  });
  describe('step 1', () => {
    test('should render comp verify email otp', async () => {
      mockStep = 1;
      const { getByTestId } = render(<Register />);
      expect(getByTestId('verify-otp-comp')).toBeInTheDocument();
    });
  });
  describe('step 2', () => {
    test('should render comp register role', async () => {
      mockStep = 2;
      const { getByTestId } = render(<Register />);
      expect(getByTestId('register-role-comp')).toBeInTheDocument();
    });
  });
  describe('step 3', () => {
    test('should render comp register form', async () => {
      mockStep = 3;
      const { getByTestId } = render(<Register />);
      expect(getByTestId('register-form-comp')).toBeInTheDocument();
    });
  });
  test('should navigate home cause already login', () => {
    mockLogin = true;
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
  test('Matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
