import { render, fireEvent } from '@utils/testHelper';
import Favorit from '@pages/Favorit';

let wrapper;
const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
let mockMerchants = [
  {
    id: 1,
    name: 'Merchant 1',
    description: 'Description 1',
    distance: 2,
  },
];

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));
jest.mock('@pages/Favorit/selectors', () => ({
  selectMerchants: () => mockMerchants,
}));

beforeEach(() => {
  wrapper = render(<Favorit />);
  jest.clearAllMocks();
});

describe('Favorit Page', () => {
  test('Correct render with merchants', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('favorit-wrap')).toBeInTheDocument();
    expect(getByTestId('card-merchant')).toBeInTheDocument();
  });

  test('Clicking the back button should call navigate', () => {
    const { getByTestId } = wrapper;
    fireEvent.click(getByTestId('back-button'));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  describe('render no merchant', () => {
    let nofav;
    beforeEach(() => {
      mockMerchants = [];
      nofav = render(<Favorit />);
    });
    test('Correct render with no merchants', () => {
      const { getByTestId } = nofav;
      expect(getByTestId('no-data')).toBeInTheDocument();
    });
    test('Matches snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
