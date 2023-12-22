import EditMerchant from '@components/EditMerchant';
import { act, fireEvent, render, screen } from '@utils/testHelper';

let wrapper;
let isOpen = true;
let inputName;
let inputDescription;

jest.mock('@components/MapLeaflet', () => () => <div>mapleafletMock</div>);

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDipatch: () => jest.fn(),
}));

const mockProps = {
  open: isOpen,
  intl: { formatMessage: jest.fn() },
  handleClose: () => (isOpen = false),
  merchant: {
    name: 'merchant',
    location: '{"lat": -6.224934545453234, "lng": 106.86266439802276 }',
    description: 'description',
  },
};

beforeEach(() => {
  act(() => {
    wrapper = render(<EditMerchant {...mockProps} />);
  });
});

describe('Edit Merchant Component', () => {
  test('Correct render', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('dialog-edit-merchant')).toBeInTheDocument();
    expect(getByTestId('button-close')).toBeInTheDocument();
  });
  test('Should be close the dialog', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-close');
    fireEvent.click(button);
    expect(isOpen).toBe(false);
  });
  test('Should be submit the dialog', () => {
    const { getByTestId } = wrapper;
    inputName = screen.getByLabelText('Nama Laundry');
    inputDescription = getByTestId('input-description');
    fireEvent.change(inputName, { target: { value: 'Laundry Mantap' } });
    fireEvent.change(inputDescription, { target: { value: 'ini adlaah deskripsi' } });
    expect(inputName.value).toBe('Laundry Mantap');
    expect(inputDescription.value).toBe('ini adlaah deskripsi');
    const button = getByTestId('button-submit');
    act(() => {
      fireEvent.click(button);
    }).then(() => {
      expect(isOpen).toBe(false);
    });
  });
  test('Should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
