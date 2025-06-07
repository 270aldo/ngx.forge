import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ChatInterface } from '../ChatInterface';

const messages = [
  { id: '1', content: 'Hi', sender: 'user', timestamp: new Date() }
];

test('renders initial messages', () => {
  render(
    <MemoryRouter>
      <ChatInterface initialMessages={messages} />
    </MemoryRouter>
  );
  expect(screen.getByText('Hi')).toBeInTheDocument();
});
