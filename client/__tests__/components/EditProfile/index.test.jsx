import EditProfile from '@components/EditProfile';
import { fireEvent, render, screen } from '@utils/testHelper';
import { act } from 'react-dom/test-utils';

let wrapper;
let isOpen = true;
let inputFullName;
let inputPhone;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDipatch: () => jest.fn(),
}));

const mockProps = {
  open: isOpen,
  intl: { formatMessage: jest.fn() },
  handleClose: () => (isOpen = false),
  profile: {
    fullName: 'merchant',
    phone: '31313131231',
  },
};

beforeEach(() => {
  act(() => {
    wrapper = render(<EditProfile {...mockProps} />);
  });
});

describe('Edit Profile Component', () => {
  test('Correct render', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('dialog-edit-profile')).toBeInTheDocument();
    expect(getByTestId('button-close')).toBeInTheDocument();
  });
  test('Should be submit the dialog', () => {
    const { getByTestId } = wrapper;
    inputFullName = screen.getByLabelText('Nama Lengkap');
    inputPhone = screen.getByLabelText('Telp/No.Hp');
    const button = getByTestId('button-submit');
    fireEvent.change(inputFullName, { target: { value: 'Ahmad Alif Sofian' } });
    fireEvent.change(inputPhone, { target: { value: '31302123131' } });
    expect(inputFullName.value).toBe('Ahmad Alif Sofian');
    expect(inputPhone.value).toBe('31302123131');
    act(() => {
      fireEvent.click(button);
    }).then(() => {
      expect(isOpen).toBe(false);
    });
  });
  test('Should be close the dialog', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-close');
    fireEvent.click(button);
    expect(isOpen).toBe(false);
  });
  test('Should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
