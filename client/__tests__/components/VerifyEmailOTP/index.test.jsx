import { render, fireEvent, screen } from '@utils/testHelper';
import { act } from 'react-dom/test-utils';
import VerifyEmailOTP from '@components/VerifyEmailOTP';

let wrapper;
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('@pages/Register/selectors', () => ({
  selectEmail: () => 'test@example.com',
  selectExpire: () => Date.now() + 1000,
  selectStep: () => 2,
}));

jest.mock('@containers/Client/selectors', () => ({
  selectTokenEmail: () => 'token',
}));

const mockProps = {
  intl: {
    formatMessage: jest.fn(),
  },
  tokenVerify: 'mockToken',
};

beforeEach(() => {
  act(() => {
    wrapper = render(<VerifyEmailOTP {...mockProps} />);
  });
  jest.clearAllMocks();
});

describe('VerifyEmailOTP Component', () => {
  test('Correct render', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('verify-email-otp-form')).toBeInTheDocument();
    expect(screen.getByLabelText('OTP')).toBeInTheDocument();
    expect(getByTestId('button-back')).toBeInTheDocument();
    expect(getByTestId('button-submit')).toBeInTheDocument();
  });

  test('Handles form submission with correct data', async () => {
    const { getByTestId } = wrapper;
    const inputOTP = screen.getByLabelText('OTP');
    const submitButton = getByTestId('button-submit');

    fireEvent.change(inputOTP, { target: { value: '1234' } });

    await act(() => {
      fireEvent.click(submitButton);
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
  test('Handles back', async () => {
    const { getByTestId } = wrapper;
    const backButton = getByTestId('button-back');
    await act(() => {
      fireEvent.click(backButton);
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  test('Matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
