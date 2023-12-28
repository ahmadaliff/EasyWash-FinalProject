import Login from '@pages/Login';
import { act, fireEvent, render, screen } from '@utils/testHelper';

let wrapper;
const mockNavigate = jest.fn();
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDipatch: () => mockDispatch,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: () => <b />,
}));

beforeEach(() => {
  act(() => {
    wrapper = render(<Login />);
  });
});

describe('Login Page', () => {
  test('render', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('login-wrap')).toBeInTheDocument();
  });
  test('shuldbe navigate to home', async () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-logo');
    act(() => {
      fireEvent.click(button);
    });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
  test('shouldbe running on submit function', async () => {
    const { getByTestId } = wrapper;
    const inputEmail = screen.getByLabelText('Email');
    const inputPassword = screen.getByLabelText('Kata Sandi');
    fireEvent.change(inputEmail, { target: { value: 'email@email.com' } });
    fireEvent.change(inputPassword, { target: { value: 'password123' } });
    const button = getByTestId('button-submit');
    await act(async () => {
      fireEvent.click(button);
      fireEvent.click(getByTestId('button-google'));
    });
  });
  test('shouldbe change type input password', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-show');
    act(() => {
      fireEvent.click(button);
    });
  });
  test('Matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
