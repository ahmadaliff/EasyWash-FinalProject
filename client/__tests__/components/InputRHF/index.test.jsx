import InputRHF from '@components/InputRHF';
import { render } from '@utils/testHelper';

let wrapper;

const mockProps = {
  input: {
    name: 'nama',
    label: 'nama',
    type: 'text',
    required: 'test',
    value: 'isi dari input',
  },
  disabled: true,
  register: jest.fn(),
  errors: {},
  children: <div>children</div>,
};

beforeEach(() => {
  wrapper = render(<InputRHF {...mockProps} />);
});

describe('InputRHF Component', () => {
  test('Correct render', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('inputRHF')).toBeInTheDocument();
  });
  test('Should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
