import { fireEvent, render } from '@utils/testHelper';
import MobileNavbar from '@components/MobileNavbar';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

let navbarUser;
let navbarAdmin;
let navbarMerchant;

const mockProps = {
  login: true,
  intl: { formatMessage: jest.fn() },
};

describe('Mobile Navbar Component', () => {
  describe('Navbar with role User', () => {
    beforeEach(() => {
      navbarUser = render(
        <MobileNavbar
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
        <MobileNavbar
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
    test('Should call navigate to admin user when button clicked', () => {
      const { getByTestId } = navbarAdmin;
      const button = getByTestId('button-admin');
      fireEvent.click(button);
      expect(mockNavigate).toHaveBeenCalledWith(`/admin/user`);
    });
    test('Should call navigate to admin deleted merchants when button clicked', () => {
      const { getByTestId } = navbarAdmin;
      const button = getByTestId('button-deletedMerchant');
      fireEvent.click(button);
      expect(mockNavigate).toHaveBeenCalledWith(`/admin/deletedMerchant`);
    });
    test('Should match with snapshot', () => {
      expect(navbarAdmin).toMatchSnapshot();
    });
  });
  describe('Navbar with role Merchant', () => {
    beforeEach(() => {
      navbarMerchant = render(
        <MobileNavbar
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
    test('Should call navigate to order when button clicked', () => {
      const { getByTestId } = navbarUser;
      const button = getByTestId('button-order');
      fireEvent.click(button);
      expect(mockNavigate).toHaveBeenCalledWith(`/laundry/orders`);
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
});
