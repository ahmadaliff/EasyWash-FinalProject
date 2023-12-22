import { render, fireEvent, screen } from '@utils/testHelper';
import EditService from '@pages/EditService';

let wrapper;
const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
const mockUseParams = jest.fn().mockReturnValue({ id: '1' });

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams,
}));
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));
jest.mock('@pages/EditService/selectors', () => ({
  selectService: () => ({
    id: 1,
    name: 'Service Name',
    price: 50,
    isUnit: true,
  }),
}));

const mockProps = {
  intl: {
    formatMessage: jest.fn(),
  },
};

beforeEach(() => {
  wrapper = render(<EditService {...mockProps} />);
  jest.clearAllMocks();
});

describe('EditService Page', () => {
  test('Correct render', async () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('editservice-page')).toBeInTheDocument();
  });

  test('Should be navigate -1', () => {
    const { getByTestId } = wrapper;
    fireEvent.click(getByTestId('button-back'));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
  test('Should change field value', () => {
    const inputName = screen.getByLabelText('Nama Layanan');
    const inputPrice = screen.getByLabelText('Harga');
    fireEvent.change(inputName, { target: { value: 'Updated Name' } });
    fireEvent.change(inputPrice, { target: { value: 2000 } });
    expect(inputName.value).toBe('Updated Name');
    expect(inputPrice.value).toBe('2000');
  });
  test('Should submit', () => {
    const { getByTestId } = wrapper;
    const buttonSubmit = getByTestId('button-submit');
    fireEvent.click(buttonSubmit);
  });

  test('Matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
