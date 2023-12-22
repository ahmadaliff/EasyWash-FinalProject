import MerchantCard from '@components/MerchantCard';
import { fireEvent, render } from '@utils/testHelper';

let wrapper;
const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));
jest.mock('@containers/Client/selectors', () => ({
  selectLogin: () => true,
  selectUser: () => ({
    id: 1,
    fullName: 'ahmad alif sofian',
    role: 'user',
    imagePath: null,
  }),
}));

const mockProps = {
  merchant: {
    id: 123,
    name: 'merchant',
    imagePath: null,
    distance: 5,
    Favorits: [],
  },
};

beforeEach(() => {
  wrapper = render(<MerchantCard {...mockProps} />);
});
describe('MerchantCard Component', () => {
  test('Correct render', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('card-merchant')).toBeInTheDocument();
    expect(getByTestId('card-wrap')).toBeInTheDocument();
  });
  test('Should be Navigate onclick card', () => {
    const { getByTestId } = wrapper;
    fireEvent.click(getByTestId('card-merchant'));
    expect(mockNavigate).toHaveBeenCalledWith(`/user/laundry/123`);
  });
  test('Dispatches actionAddToFavorit when the merchant is not favorited', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('favorit-button')).toBeInTheDocument();
    fireEvent.click(getByTestId('favorit-button'));
    expect(mockDispatch).toBeCalled();
  });
  test('Dispatches actionDeleteFromFavorit when the merchant is favorited', () => {
    const favoritedProps = {
      ...mockProps,
      merchant: {
        ...mockProps.merchant,
        Favorits: [{ userId: 1, merchantId: 123 }],
      },
    };
    wrapper.rerender(<MerchantCard {...favoritedProps} />);
    const { getByTestId } = wrapper;
    expect(getByTestId('favorit-red-button')).toBeInTheDocument();
    fireEvent.click(getByTestId('favorit-red-button'));
    expect(mockDispatch).toBeCalled();
  });

  test('Should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
