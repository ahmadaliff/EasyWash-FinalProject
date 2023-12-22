import Footer from '@components/Footer';
import { render, screen } from '@utils/testHelper';

let footer;

beforeEach(() => {
  footer = render(<Footer />);
});

describe('Footer Component', () => {
  test('Correct render', () => {
    const { getByTestId } = footer;
    expect(getByTestId('footer')).toBeInTheDocument();
    expect(getByTestId('linkedIn')).toBeInTheDocument();
    expect(getByTestId('github')).toBeInTheDocument();
    expect(getByTestId('email')).toBeInTheDocument();
  });
  test('Should be render text', () => {
    expect(screen.getByText('alif12sofian@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('2023, EasyWash - Ahmad Alif Sofian')).toBeInTheDocument();
  });
  test('Should match with snapshot', () => {
    expect(footer).toMatchSnapshot();
  });
});
