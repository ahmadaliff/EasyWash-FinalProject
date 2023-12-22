import MerchantInfo from '@components/MerchantInfo';
import { render } from '@utils/testHelper';

let wrapper;

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

const mockProps = {
  merchant: {
    name: 'merchant',
    imagePath: null,
    distance: 5,
    Favorits: [],
    userId: 2,
  },
};

beforeEach(() => {
  wrapper = render(<MerchantInfo {...mockProps} />);
});
describe('MerchantInf0 Component', () => {
  test('Correct render', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('merchant-info')).toBeInTheDocument();
  });
  test('Should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
