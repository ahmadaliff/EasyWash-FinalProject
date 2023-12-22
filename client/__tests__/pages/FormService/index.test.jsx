import { render, screen, fireEvent } from '@utils/testHelper';
import { act } from 'react-dom/test-utils';

import FormService from '@pages/FormService';

let wrapper;
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}));

const mockProps = {
  intl: { formatMessage: jest.fn() },
};

beforeEach(() => {
  wrapper = render(<FormService {...mockProps} />);
});

describe('FormService Component', () => {
  test('renders FormService component', () => {
    const { getByTestId } = wrapper;
    expect(screen.getByLabelText('Nama Layanan')).toBeInTheDocument();
    expect(screen.getByLabelText('Harga')).toBeInTheDocument();
    expect(getByTestId('back-button')).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    const { getByTestId } = wrapper;
    const formData = {
      name: 'Service Name',
      price: 40000,
    };
    const button = getByTestId('button-submit');
    fireEvent.change(screen.getByLabelText('Nama Layanan'), { target: { value: formData.name } });
    fireEvent.change(screen.getByLabelText('Harga'), { target: { value: formData.price } });
    await act(async () => {
      fireEvent.click(button);
    });
  });

  test('navigate bacck when back button click', async () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('back-button');
    await act(async () => {
      fireEvent.click(button);
    });
  });
  test('Matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
