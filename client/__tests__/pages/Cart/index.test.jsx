import Cart from '@pages/Cart';
import { fireEvent, render } from '@utils/testHelper';

let wrapper;

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock('@components/MapLeaflet', () => () => <div>mapleafletMock</div>);

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDipatch: () => mockDispatch,
}));

jest.mock('@pages/Cart/selectors', () => ({
  selectMerchants: () => [
    {
      Services: [{ name: 'service', price: 2000, Carts: [{ id: 1, quantity: 1 }] }],
      name: 'merchant',
      location: '{"lat": -6.224934545453234, "lng": 106.86266439802276 }',
      description: 'description',
      imagePath: null,
      userId: 2,
    },
  ],
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  wrapper = render(<Cart carts={[{ name: 'test' }]} />);
});

describe('Cart Page', () => {
  test('Correct render', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('cart-wrap')).toBeInTheDocument();
    expect(getByTestId('button-back')).toBeInTheDocument();
  });
  test('Should navigate back', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-back');
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
  test('Should create order and go to order page', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-create');
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/order');
  });
  test('Should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
