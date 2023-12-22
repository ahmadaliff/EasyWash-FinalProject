import DialogMerchantsMap from '@components/DialogMerchantsMap';
import { fireEvent, render, screen } from '@utils/testHelper';

let wrapper;
let isOpen = true;

jest.mock('@components/MapLeaflet', () => () => <div>mapleafletMock</div>);

const mockProps = {
  open: isOpen,
  handleClose: () => (isOpen = false),
  merchants: [{}],
};

beforeEach(() => {
  wrapper = render(<DialogMerchantsMap {...mockProps} />);
});

describe('DialogMerchantMap Component', () => {
  test('Correct render', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('dialog-merchant-map')).toBeInTheDocument();
    expect(getByTestId('button-close')).toBeInTheDocument();
  });
  test('Should be close the dialog', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-close');
    fireEvent.click(button);
    expect(isOpen).toBe(false);
  });
  test('Should render text in the dialog', () => {
    expect(screen.getByText('Peta laundry (dalam radius 3 km)')).toBeInTheDocument();
  });
  test('Should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
