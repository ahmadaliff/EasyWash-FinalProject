import Profile from '@pages/Profile';
import { render, fireEvent, act } from '@utils/testHelper';

let wrapper;
const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));
jest.mock('@pages/Profile/selectors', () => ({
  selectProfile: () => ({
    imagePath: null,
    fullName: 'ahmad alif',
    phone: '03313131831',
    email: 'email@email.com',
    role: 'admin',
  }),
}));
jest.mock('@components/MapLeaflet', () => jest.fn().mockImplementation(() => <div />));

beforeEach(() => {
  act(() => {
    wrapper = render(<Profile />);
  });
});

describe('Profile Page', () => {
  test('render', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('profile-page')).toBeInTheDocument();
  });
  test('navigate back when back button click', async () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-change-image');
    await act(async () => {
      fireEvent.click(button);
    });
    expect(getByTestId('input-image')).toBeInTheDocument();
  });
  test('should be open dialog edit', async () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-edit');
    await act(async () => {
      fireEvent.click(button);
    });
    expect(getByTestId('dialog-edit-profile')).toBeInTheDocument();
  });
  test('Matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
