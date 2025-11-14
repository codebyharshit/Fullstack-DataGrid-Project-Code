import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataGridToolbar from '../components/DataGridToolbar';

describe('DataGridToolbar', () => {
  const mockSearch = vi.fn();
  const mockFilter = vi.fn();
  const mockClear = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when user searches for cars', () => {
    it('should call search when clicking the button', async () => {
      const user = userEvent.setup();
      render(
        <DataGridToolbar
          onSearch={mockSearch}
          onFilter={mockFilter}
          onClear={mockClear}
        />
      );

      const searchInput = screen.getByPlaceholderText(/search by brand/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      await user.type(searchInput, 'Tesla');
      await user.click(searchButton);

      expect(mockSearch).toHaveBeenCalledWith('Tesla');
    });

    it('should search when pressing Enter key', async () => {
      const user = userEvent.setup();
      render(
        <DataGridToolbar
          onSearch={mockSearch}
          onFilter={mockFilter}
          onClear={mockClear}
        />
      );

      const searchInput = screen.getByPlaceholderText(/search by brand/i);
      await user.type(searchInput, 'BMW{Enter}');

      expect(mockSearch).toHaveBeenCalledWith('BMW');
    });

    it('should not search with empty query', async () => {
      const user = userEvent.setup();
      render(
        <DataGridToolbar
          onSearch={mockSearch}
          onFilter={mockFilter}
          onClear={mockClear}
        />
      );

      const searchButton = screen.getByRole('button', { name: /search/i });
      await user.click(searchButton);

      expect(mockSearch).not.toHaveBeenCalled();
    });
  });

  describe('when user applies filters', () => {
    it('should show filter panel when clicking filter button', async () => {
      const user = userEvent.setup();
      render(
        <DataGridToolbar
          onSearch={mockSearch}
          onFilter={mockFilter}
          onClear={mockClear}
        />
      );

      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      expect(screen.getByText(/advanced filters/i)).toBeInTheDocument();
    });

    it('should add new filter when clicking add button', async () => {
      const user = userEvent.setup();
      render(
        <DataGridToolbar
          onSearch={mockSearch}
          onFilter={mockFilter}
          onClear={mockClear}
        />
      );

      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      const addButton = screen.getByRole('button', { name: /add filter/i });
      await user.click(addButton);

      expect(screen.getAllByText(/field/i).length).toBeGreaterThan(0);
    });
  });

  describe('when user clears everything', () => {
    it('should reset search and filters', async () => {
      const user = userEvent.setup();
      render(
        <DataGridToolbar
          onSearch={mockSearch}
          onFilter={mockFilter}
          onClear={mockClear}
        />
      );

      const searchInput = screen.getByPlaceholderText(/search by brand/i);
      await user.type(searchInput, 'Tesla');

      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);

      expect(mockClear).toHaveBeenCalled();
      expect(searchInput.value).toBe('');
    });
  });
});
