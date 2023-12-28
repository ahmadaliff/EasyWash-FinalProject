import MyMerchant from '@pages/MyMerchant';
import { render, fireEvent, act } from '@utils/testHelper';

let wrapper;
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@components/EditMerchant', () => jest.fn().mockImplementation(() => <div data-testid="dialog-merchant" />));

jest.mock('@pages/MyMerchant/selectors', () => ({
  selectMerchant: () => ({
    imagePath: null,
    name: 'laundry',
    description: 'description',
  }),
}));

beforeEach(() => {
  act(() => {
    wrapper = render(<MyMerchant />);
  });
});

describe('My Merchants Page', () => {
  test('render', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('myMerchant-wrap')).toBeInTheDocument();
  });
  test('navigate back when back button click', async () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('back-button');
    await act(async () => {
      fireEvent.click(button);
    });
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
  test('open dialog when button click', async () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-dialog');
    act(() => {
      fireEvent.click(button);
    });
    expect(getByTestId('dialog-merchant')).toBeInTheDocument();
  });
  test('Matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
