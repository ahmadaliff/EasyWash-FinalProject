import PopupMessage from '@components/PopupMessage/Dialog';
import { fireEvent, render, screen } from '@utils/testHelper';

let wrapper;
let isOpen = true;

const mockProps = {
  open: isOpen,
  title: 'app_profile',
  message: 'app_header_login',
  onClose: () => (isOpen = false),
};

describe('PopupMessage Component', () => {
  describe('with title and message define', () => {
    beforeEach(() => {
      wrapper = render(<PopupMessage {...mockProps} />);
    });
    test('Correct render', () => {
      const { getByTestId } = wrapper;
      expect(getByTestId('popup-wrap')).toBeInTheDocument();
      expect(getByTestId('button-close')).toBeInTheDocument();
    });
    test('Should close when button clicked', () => {
      const { getByTestId } = wrapper;
      const button = getByTestId('button-close');
      fireEvent.click(button);
      expect(isOpen).toBe(false);
    });
    test('Should be render text', () => {
      expect(screen.getByText('Profil')).toBeInTheDocument();
      expect(screen.getByText('Masuk')).toBeInTheDocument();
    });
  });
  describe('without title and message define', () => {
    beforeEach(() => {
      wrapper = render(<PopupMessage {...mockProps} title={undefined} message={undefined} />);
    });
    test('Correct render', () => {
      const { getByTestId } = wrapper;
      expect(getByTestId('popup-wrap')).toBeInTheDocument();
      expect(getByTestId('button-close')).toBeInTheDocument();
    });
    test('Should be render text', () => {
      expect(screen.getByText('Terjadi kesalahan!')).toBeInTheDocument();
      expect(screen.getByText('Maaf, telah terjadi kesalahan. Silakan coba beberapa saat lagi')).toBeInTheDocument();
    });
    test('Should close when button clicked', () => {
      const { getByTestId } = wrapper;
      const button = getByTestId('button-close');
      fireEvent.click(button);
      expect(isOpen).toBe(false);
    });
    test('Should match with snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
