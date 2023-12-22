import { render, fireEvent } from '@utils/testHelper';
import ChannelInner from '@components/ChannelInner';

jest.mock('stream-chat-react', () => ({
  ChannelHeader: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
  MessageInput: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
  MessageList: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
  Thread: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
  Window: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
  useChannelDeletedListener: () => jest.fn(),
}));

jest.mock('@react-leaflet/core', () => ({ createControlComponent: () => jest.fn() }));

jest.mock('react-dom/server', () => ({
  renderToStaticMarkup: jest.fn(),
}));

let isOpen = false;

const mockProps = {
  isMenuOpen: isOpen,
  setIsMenuOpen: () => {
    isOpen = true;
  },
};

let wrapper;

beforeEach(() => {
  wrapper = render(<ChannelInner {...mockProps} />);
});

describe('ChannelInner', () => {
  test('Should render correctly', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('window-wrap')).toBeInTheDocument();
    expect(getByTestId('open-menu')).toBeInTheDocument();
  });
  test('Should call navigate when button clicked', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('open-menu');
    fireEvent.click(button);
    expect(isOpen).toBe(true);
  });
  test('Should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
