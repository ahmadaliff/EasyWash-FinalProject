import RegisterForm from '@components/RegisterForm';
import { act, fireEvent, render, screen } from '@utils/testHelper';

let wrapper;
let inputFullName;
let inputPhone;
let inputPassword;
let ConfirmPassword;

const mockProps = {
  intl: { formatMessage: jest.fn() },
};
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  act(() => {
    wrapper = render(<RegisterForm {...mockProps} />);
  });
});
describe('RegisterForm Component', () => {
  test('Correct render', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('form-register')).toBeInTheDocument();
  });
  test('Should input properly', () => {
    const { getByTestId } = wrapper;
    const buttonShowPass = getByTestId('button-show-pass');
    inputFullName = screen.getByLabelText('Nama Lengkap');
    inputPhone = getByTestId('phone-input');
    inputPassword = screen.getByLabelText('Kata Sandi');
    ConfirmPassword = screen.getByLabelText('Konfirmasi Kata Sandi');
    fireEvent.change(inputFullName, { target: { value: 'Ahmad Alif Sofian' } });
    fireEvent.change(inputPhone, { target: { value: '+6281302123131' } });
    fireEvent.change(inputPassword, { target: { value: 'password123' } });
    fireEvent.change(ConfirmPassword, { target: { value: 'password123' } });
    expect(inputFullName.value).toBe('Ahmad Alif Sofian');
    expect(inputPhone.value).toBe('+62 813 0212 3131');
    expect(inputPassword.value).toBe('password123');
    expect(ConfirmPassword.value).toBe('password123');
    fireEvent.click(buttonShowPass);
    expect(inputPassword.type).toBe('text');
  });
  test('Should call function onsubmit properly', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-submit');
    act(() => {
      fireEvent.click(button);
    });
  });
  test('Should call click button properly', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-back');
    fireEvent.click(button);
  });

  test('Should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
