import { render, fireEvent, screen } from '@utils/testHelper';
import DetailOrder from '@components/DetailOrder';

jest.mock('@components/MapRouting', () => jest.fn(() => <div>mapleafletMock</div>));

jest.mock('react-dom/server', () => ({
  renderToStaticMarkup: jest.fn(),
}));

let isOpen = true;

const mockProps = {
  open: isOpen,
  order: {
    id: 1,
    totalPrice: 20000,
    status: 'app_pending',
    Services: [
      {
        name: 'service',
        ServicesOrdered: {
          quantity: 2,
        },
        price: 10000,
        Merchant: { location: '{"lat": -6.224934545453234, "lng": 106.86266439802276 }' },
      },
    ],
    location: '{"lat": -6.224934545453234, "lng": 106.86266439802276 }',
  },
  handleClose: () => {
    isOpen = false;
  },
};

let wrapper;

beforeEach(() => {
  wrapper = render(<DetailOrder {...mockProps} />);
});

describe('Detail Order', () => {
  test('Should render correctly', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('dialog-detail')).toBeInTheDocument();
  });
  test('Should call navigate when button clicked', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-close');
    fireEvent.click(button);
    expect(isOpen).toBe(false);
  });
  test('Should be render text', () => {
    expect(screen.getByText('Detail pesanan')).toBeInTheDocument();
    expect(screen.getByText('Id Pesanan')).toBeInTheDocument();
    expect(screen.getByText('Harga Total')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Ditunda')).toBeInTheDocument();
  });
  test('Should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
