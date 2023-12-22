import VerifyEmail from '@components/VerifyEmail';
import { render, fireEvent, screen } from '@utils/testHelper';
import { act } from 'react-dom/test-utils';

let wrapper;
let wrapperVerified;
let mockVerify = false;

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('@pages/Register/selectors', () => ({
  selectEmail: () => 'test@example.com',
  selectStep: () => 1,
}));
jest.mock('@containers/Client/selectors', () => ({
  selectIsVerify: () => mockVerify,
}));

const mockProps = {
  intl: { formatMessage: jest.fn() },
};

describe('VerifyEmail Component', () => {
  describe('with unverified email', () => {
    beforeEach(() => {
      act(() => {
        wrapper = render(<VerifyEmail {...mockProps} />);
      });
      jest.clearAllMocks();
    });
    test('Correct render', () => {
      const { getByTestId } = wrapper;
      expect(getByTestId('verify-email-form')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(getByTestId('submit-button')).toBeInTheDocument();
    });

    test('Handles form submission when email is not verified', async () => {
      const { getByTestId } = wrapper;
      const inputEmail = screen.getByLabelText('Email');
      const submitButton = getByTestId('submit-button');
      fireEvent.change(inputEmail, { target: { value: 'new-email@example.com' } });

      await act(() => {
        fireEvent.click(submitButton);
      });
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
    test('Handles form submission when email is not verified and same as selector', async () => {
      const { getByTestId } = wrapper;
      const inputEmail = screen.getByLabelText('Email');
      const submitButton = getByTestId('submit-button');
      fireEvent.change(inputEmail, { target: { value: 'test@example.com' } });

      await act(() => {
        fireEvent.click(submitButton);
      });
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
  });
  describe('with verified email', () => {
    beforeEach(() => {
      mockVerify = true;
      act(() => {
        wrapperVerified = render(<VerifyEmail {...mockProps} />);
      });
      jest.clearAllMocks();
    });
    test('Handles form submission when email is verified', async () => {
      const { getByTestId } = wrapperVerified;
      const inputEmail = screen.getByLabelText('Email');
      const submitButton = getByTestId('submit-button');
      fireEvent.change(inputEmail, { target: { value: 'test@example.com' } });
      await act(() => {
        fireEvent.click(submitButton);
      });
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
    test('Matches snapshot', () => {
      expect(wrapperVerified).toMatchSnapshot();
    });
  });
});
