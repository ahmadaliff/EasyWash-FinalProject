import { render, fireEvent } from '@utils/testHelper';
import { act } from 'react-dom/test-utils';
import ServiceDialog from '@components/ServiceDialog';

let wrapper;
const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

let isOpen = true;

const mockProps = {
  open: isOpen,
  handleClose: () => (isOpen = false),
  service: {
    id: 1,
    name: 'service',
    price: 12000,
  },
};
beforeEach(() => {
  act(() => {
    wrapper = render(<ServiceDialog {...mockProps} />);
  });
  jest.clearAllMocks();
});

describe('ServiceDialog Component', () => {
  test('Correct render', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('dialog-service')).toBeInTheDocument();
  });

  test('Calls handleClose when close button is clicked', () => {
    const { getByLabelText } = wrapper;
    act(() => {
      fireEvent.click(getByLabelText('close'));
    });
    expect(isOpen).toBe(false);
  });

  test('Updates quantity when +/- buttons are clicked', () => {
    const { getByTestId, getByText } = wrapper;
    act(() => {
      fireEvent.click(getByTestId('button-min'));
    });
    expect(getByText('1')).toBeInTheDocument();

    act(() => {
      fireEvent.click(getByTestId('button-plus'));
    });
    expect(getByText('2')).toBeInTheDocument();
  });

  test('Dispatches actionAddToCart when "Add to Cart" button is clicked', () => {
    const { getByTestId } = wrapper;
    act(() => {
      fireEvent.click(getByTestId('button-add'));
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  test('Calls handleCreateOrder and navigates when "Create Order" button is clicked', () => {
    const { getByTestId } = wrapper;
    act(() => {
      fireEvent.click(getByTestId('button-create'));
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/order');
  });

  test('Matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
