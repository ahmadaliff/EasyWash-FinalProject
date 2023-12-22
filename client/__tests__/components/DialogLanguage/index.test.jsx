import { render, fireEvent } from '@utils/testHelper';
import DialogLanguage from '@components/DialogLanguage';

let wrapper;
const mockHandleSelectLang = jest.fn();
const mockHandleClose = jest.fn();

const mockProps = {
  handleSelectLang: mockHandleSelectLang,
  locale: 'en',
  open: true,
  handleClose: mockHandleClose,
};

beforeEach(() => {
  wrapper = render(<DialogLanguage {...mockProps} />);
  jest.clearAllMocks();
});

describe('DialogLanguage Component', () => {
  test('Correct render', () => {
    const { getByText, getByLabelText } = wrapper;
    expect(getByText('Pilih Bahasa')).toBeInTheDocument();
    expect(getByLabelText('close')).toBeInTheDocument();
    expect(getByText('Bahasa Inggris')).toBeInTheDocument();
    expect(getByText('Bahasa Indonesia')).toBeInTheDocument();
  });

  test('Closes the dialog when close button is clicked', () => {
    const { getByLabelText } = wrapper;
    const closeButton = getByLabelText('close');
    fireEvent.click(closeButton);
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  test('Calls handleSelectLang when a language is selected', () => {
    const { getByText } = wrapper;
    const englishButton = getByText('Bahasa Inggris');
    fireEvent.click(englishButton);
    expect(mockHandleSelectLang).toHaveBeenCalledTimes(1);
  });

  test('Matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
