import { render, fireEvent, screen, act } from '@utils/testHelper';
import ResetPassword from '@pages/ResetPassword';

let wrapper;
const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
const mockUseParams = jest.fn().mockReturnValue({ token: 'token' });

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams,
  Link: () => <b />,
}));
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

beforeEach(() => {
  act(() => {
    wrapper = render(<ResetPassword />);
  });
  jest.clearAllMocks();
});

describe('ResetPassword Page', () => {
  describe('with login', () => {
    jest.mock('@containers/Client/selectors', () => ({
      selectLogin: () => true,
    }));
    test('souldbe navigate to home', () => {
      setTimeout(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      }, 1500);
    });
  });
  describe('login false', () => {
    jest.mock('@containers/Client/selectors', () => ({
      selectLogin: () => false,
    }));
    test('Correct render', () => {
      const { getByTestId } = wrapper;
      expect(getByTestId('reset-password-page')).toBeInTheDocument();
    });

    test('Should be navigate to home', () => {
      const { getByTestId } = wrapper;
      act(() => {
        fireEvent.click(getByTestId('logo'));
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
    test('Should change field value', () => {
      const inputPassword = screen.getByLabelText('Kata Sandi Baru');
      const inputConfirmPassword = screen.getByLabelText('Konfirmasi Kata Sandi');
      fireEvent.change(inputPassword, { target: { value: 'password' } });
      fireEvent.change(inputConfirmPassword, { target: { value: 'password123' } });
      expect(inputPassword.value).toBe('password');
      expect(inputConfirmPassword.value).toBe('password123');
    });
    test('Should change type pass to text', () => {
      const { getByTestId } = wrapper;
      const button = getByTestId('button-show-pass');
      const inputConfirmPassword = screen.getByLabelText('Konfirmasi Kata Sandi');
      fireEvent.change(button);
      expect(inputConfirmPassword).toHaveAttribute('type', 'password');
    });
    test('Should submit', async () => {
      const { getByTestId } = wrapper;
      const buttonSubmit = getByTestId('button-submit');
      await act(async () => {
        fireEvent.click(buttonSubmit);
      });
    });

    test('Matches snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
