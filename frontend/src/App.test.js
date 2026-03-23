import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./pages/Dashboard', () => () => <div>Dashboard Page</div>);
jest.mock('./pages/Forecast', () => () => <div>Forecast Page</div>);
jest.mock('./pages/Safety', () => () => <div>Safety Page</div>);
jest.mock('./pages/Profile', () => () => <div>Profile Page</div>);
jest.mock('./components/ChatbotFab', () => () => null);

test('renders navbar links', () => {
  render(<App />);
  expect(screen.getByText(/cyclone dashboard/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /forecast/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /safety/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument();
});
