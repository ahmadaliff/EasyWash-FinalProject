import NotFound from '@pages/NotFound';
import { render, fireEvent, act } from '@utils/testHelper';

let wrapper;
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  act(() => {
    wrapper = render(<NotFound />);
  });
});

describe('Not Found Page', () => {
  test('render', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('not-found')).toBeInTheDocument();
  });
  test('navigate back when back button click', async () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-home');
    await act(async () => {
      fireEvent.click(button);
    });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
  test('Matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
