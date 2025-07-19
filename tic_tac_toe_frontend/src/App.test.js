import { render, screen } from '@testing-library/react';
import App from './App';

test('renders tic tac toe game status (Turn/X/O/Draw)', () => {
  render(<App />);
  const statusElement = screen.getByText(/Turn:|wins|Draw/i);
  expect(statusElement).toBeInTheDocument();
});
