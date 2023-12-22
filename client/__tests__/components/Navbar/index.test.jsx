import { fireEvent, render, screen } from '@utils/testHelper';
import Navbar from '@components/Navbar';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

let navbarUser;
let navbarAdmin;
let navbarMerchant;
let navbarWithoutLogin;

const mockProps = {
  locale: 'id',
  theme: 'light',
  login: true,
  intl: { formatMessage: jest.fn() },
};

describe('Navbar Component', () => {
  describe('Navbar with role User', () => {
    beforeEach(() => {
      navbarUser = render(
        <Navbar
          {...mockProps}
          user={{
            role: 'user',
            fullName: 'ahmad alif sofian ',
            iamgePath: null,
          }}
        />
      );
    });
    test('Correct render', () => {
      const { getByTestId } = navbarUser;
      expect(getByTestId('navbar')).toBeInTheDocument();
    });
    test('Should be render text', () => {
      expect(screen.getByText('ahmad alif sofian')).toBeInTheDocument();
    });
    test('Should call navigate to profile when button clicked', () => {
      const { getByTestId } = navbarUser;
      const togleButton = getByTestId('button-togle');
      fireEvent.click(togleButton);
      const button = getByTestId('button-profile');
      fireEvent.click(button);
      expect(mockNavigate).toHaveBeenCalledWith(`/profile`);
    });
    test('Should call navigate to favorit when button clicked', () => {
      const { getByTestId } = navbarUser;
      const button = getByTestId('button-favorit');
      fireEvent.click(button);
      expect(mockNavigate).toHaveBeenCalledWith(`/favorit`);
    });
    test('Should call navigate to cart when button clicked', () => {
      const { getByTestId } = navbarUser;
      const button = getByTestId('button-cart');
      fireEvent.click(button);
      expect(mockNavigate).toHaveBeenCalledWith(`/cart`);
    });
    test('Should call navigate to order when button clicked', () => {
      const { getByTestId } = navbarUser;
      const button = getByTestId('button-order');
      fireEvent.click(button);
      expect(mockNavigate).toHaveBeenCalledWith(`/user/order`);
    });
    test('Should call navigate to chat when button clicked', () => {
      const { getByTestId } = navbarUser;
      const button = getByTestId('button-chat');
      fireEvent.click(button);
      expect(mockNavigate).toHaveBeenCalledWith(`/chat`);
    });
  });
  describe('Navbar with role Admin', () => {
    beforeEach(() => {
      navbarAdmin = render(
        <Navbar
          {...mockProps}
          user={{
            role: 'admin',
            fullName: 'ahmad alif sofian ',
            iamgePath: null,
          }}
        />
      );
    });
    test('Correct render', () => {
      const { getByTestId } = navbarAdmin;
      expect(getByTestId('navbar')).toBeInTheDocument();
    });
    test('Should be render text', () => {
      expect(screen.getByText('ahmad alif sofian')).toBeInTheDocument();
    });
    test('Should call navigate to admin iuser when button clicked', () => {
      const { getByTestId } = navbarAdmin;
      const button = getByTestId('button-admin');
      fireEvent.click(button);
      expect(mockNavigate).toHaveBeenCalledWith(`/admin/user`);
    });
    test('Should match with snapshot', () => {
      expect(navbarAdmin).toMatchSnapshot();
    });
  });
  describe('Navbar with role Merchant', () => {
    beforeEach(() => {
      navbarMerchant = render(
        <Navbar
          {...mockProps}
          user={{
            role: 'merchant',
            fullName: 'ahmad alif sofian ',
            iamgePath: null,
          }}
        />
      );
    });
    test('Correct render', () => {
      const { getByTestId } = navbarMerchant;
      expect(getByTestId('navbar')).toBeInTheDocument();
    });
    test('Should be render text', () => {
      expect(screen.getByText('ahmad alif sofian')).toBeInTheDocument();
    });
    test('Should call navigate to service when button clicked', () => {
      const { getByTestId } = navbarMerchant;
      const button = getByTestId('button-service');
      fireEvent.click(button);
      expect(mockNavigate).toHaveBeenCalledWith(`/service`);
    });
    test('Should call navigate to laundry when button clicked', () => {
      const { getByTestId } = navbarMerchant;
      const button = getByTestId('button-laundry');
      fireEvent.click(button);
      expect(mockNavigate).toHaveBeenCalledWith(`/laundry`);
    });
  });
  describe('Navbar without login', () => {
    beforeEach(() => {
      navbarWithoutLogin = render(<Navbar {...mockProps} user={undefined} login={false} />);
    });
    test('should Correct render', () => {
      const { getByTestId } = navbarWithoutLogin;
      expect(getByTestId('navbar')).toBeInTheDocument();
    });
    test('Should call navigate to login when button clicked', () => {
      const { getByTestId } = navbarWithoutLogin;
      const togleButton = getByTestId('button-togle');
      fireEvent.click(togleButton);
      const button = getByTestId('button-login');
      fireEvent.click(button);
      expect(mockNavigate).toHaveBeenCalledWith(`/login`);
    });
    test('Should call navigate to register when button clicked', () => {
      const { getByTestId } = navbarWithoutLogin;
      const togleButton = getByTestId('button-togle');
      fireEvent.click(togleButton);
      const button = getByTestId('button-register');
      fireEvent.click(button);
      expect(mockNavigate).toHaveBeenCalledWith(`/register`);
    });
    test('Should call open dialog language when button clicked', () => {
      const { getByTestId } = navbarWithoutLogin;
      const togleButton = getByTestId('button-togle');
      fireEvent.click(togleButton);
      const buttonDialog = getByTestId('button-dialog-language');
      fireEvent.click(buttonDialog);
    });
    test('Should change theme when button clicked', () => {
      const { getByTestId } = navbarWithoutLogin;
      const togleButton = getByTestId('button-togle');
      fireEvent.click(togleButton);
      const buttonTheme = getByTestId('toggleTheme');
      fireEvent.click(buttonTheme);
      expect(screen.getByText('light')).toBeInTheDocument();
    });
    test('Should match with snapshot', () => {
      expect(navbarMerchant).toMatchSnapshot();
    });
  });
});
