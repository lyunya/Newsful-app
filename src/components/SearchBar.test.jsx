import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('submits the trimmed query', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByRole('searchbox'), '  climate  ');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(onSearch).toHaveBeenCalledWith('climate');
  });

  it('offers a way back to top stories during a search', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<SearchBar onSearch={() => {}} activeQuery="climate" onClear={onClear} />);

    expect(screen.getByText(/showing results for/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /back to top stories/i }));
    expect(onClear).toHaveBeenCalled();
  });
});
