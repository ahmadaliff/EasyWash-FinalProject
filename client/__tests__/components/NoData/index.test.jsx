import NoData from '@components/NoData';
import { render } from '@utils/testHelper';

let wrapper;

beforeEach(() => {
  wrapper = render(<NoData />);
});
describe('NoData Component', () => {
  test('Correct render', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('no-data')).toBeInTheDocument();
  });
  test('Should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
