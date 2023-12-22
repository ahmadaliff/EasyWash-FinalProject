import ServiceCart from '@components/ServiceCart';
import { fireEvent, render } from '@utils/testHelper';

let wrapper;
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const mockProps = {
  service: {
    name: 'cuci kiloan',
    price: 2000,
    Carts: [{ quantity: 1, id: 1 }],
  },
};
beforeEach(() => {
  wrapper = render(<ServiceCart {...mockProps} />);
  jest.clearAllMocks();
});
describe('NoData Component', () => {
  test('Correct render', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('service-cart')).toBeInTheDocument();
  });
  test('Button min clicked', () => {
    const { getByTestId, getByText } = wrapper;
    const button = getByTestId('button-min');
    fireEvent.click(button);
    expect(getByText('1')).toBeInTheDocument();
  });
  test('Button min clicked', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-plus');
    fireEvent.click(button);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
  test('Button min clicked', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-delete');
    fireEvent.click(button);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
  test('Should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
