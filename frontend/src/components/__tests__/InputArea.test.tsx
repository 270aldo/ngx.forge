import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputArea } from '../InputArea';

test('sends message on submit', async () => {
  const onSend = jest.fn();
  render(<InputArea onSendMessage={onSend} />);
  const input = screen.getByPlaceholderText(/type a message/i);
  await userEvent.type(input, 'hello');
  await userEvent.keyboard('{Enter}');
  expect(onSend).toHaveBeenCalledWith('hello');
});
