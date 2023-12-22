import RegisterRole from '@components/RegisterRole';
import { fireEvent, render, screen } from '@utils/testHelper';
import { act } from 'react-dom/test-utils';

let wrapper;
let inputName;
let inputDescription;

const mockProps = {
  intl: { formatMessage: jest.fn() },
  step: 10,
};

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}));
jest.mock('@pages/Register/selectors', () => ({
  ...jest.requireActual('@pages/Register/selectors'),
  selectRole: () => 'merchant',
}));

jest.mock('@components/MapLeaflet', () => () => <div>MockMapLeaflet</div>);

beforeEach(() => {
  act(() => {
    wrapper = render(<RegisterRole {...mockProps} />);
  });
});
describe('RegisterRole Component', () => {
  test('Correct render', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('register-role')).toBeInTheDocument();
  });
  test('Should change role state', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-role-merchant');
    fireEvent.click(button);
  });
  test('Should submit properly with role merchant', async () => {
    const { getByTestId } = wrapper;
    inputName = screen.getByLabelText('Nama Laundry');
    inputDescription = getByTestId('input-description');
    fireEvent.change(inputName, { target: { value: 'Laundry Mantap' } });
    fireEvent.change(inputDescription, { target: { value: 'ini adlaah deskripsi' } });
    expect(inputName.value).toBe('Laundry Mantap');
    expect(inputDescription.value).toBe('ini adlaah deskripsi');
    const button = getByTestId('button-submit');
    await act(() => {
      fireEvent.click(button);
    });
  });
  test('Should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
