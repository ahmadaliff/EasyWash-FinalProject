import Laundry from '@pages/Laundry';
import { render, fireEvent, act } from '@utils/testHelper';

let wrapper;
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@pages/Laundry/selectors', () => ({
  selectMerchant: () => ({
    imagePath: null,
    name: 'laundry',
    description: 'description',
    Services: [
      {
        name: 'reguler',
        isUnit: false,
        price: 2000,
      },
    ],
  }),
}));

beforeEach(() => {
  act(() => {
    wrapper = render(<Laundry />);
  });
});

describe('Laundry Page', () => {
  test('render', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('laundry-page')).toBeInTheDocument();
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
    expect(getByTestId('dialog-service')).toBeInTheDocument();
  });
  test('Matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
