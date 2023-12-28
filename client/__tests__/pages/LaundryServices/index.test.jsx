import LaundryServices from '@pages/LaundryServices';
import { render, fireEvent, act } from '@utils/testHelper';

let wrapper;
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@pages/LaundryServices/selectors', () => ({
  selectServices: () => ({
    data: [
      {
        isUnit: true,
        enable: true,
        id: 2,
      },
    ],
  }),
}));

beforeEach(() => {
  act(() => {
    wrapper = render(<LaundryServices />);
  });
});

describe('Laundry Services Page', () => {
  test('render', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('laundry-services')).toBeInTheDocument();
  });
  test('navigate back when back button click', async () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('back-button');
    await act(async () => {
      fireEvent.click(button);
    });
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
  test('shouldbe navigate to edit', async () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-edit');
    act(() => {
      fireEvent.click(button);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/service/edit/2');
  });
  test('shouldbe navigate to add', async () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-add');
    act(() => {
      fireEvent.click(button);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/service/add');
  });
  test('Matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
