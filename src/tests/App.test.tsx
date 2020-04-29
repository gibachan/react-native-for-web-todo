import React from 'react';
import { render } from '@testing-library/react';
import App from '../app/App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Todoリスト/i);
  expect(linkElement).toBeInTheDocument();
});
