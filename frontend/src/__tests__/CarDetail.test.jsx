import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import CarDetail from '../pages/CarDetail';
import { electricCarsAPI } from '../services/api';

vi.mock('../services/api', () => ({
  electricCarsAPI: {
    getById: vi.fn(),
  },
}));

const mockCar = {
  id: 1,
  brand: 'Tesla',
  model: 'Model 3',
  price_euro: 45000,
  range_km: 500,
  accel_sec: 3.5,
  top_speed_kmh: 225,
  efficiency_whkm: 150,
  body_style: 'Sedan',
  seats: 5,
  segment: 'D',
  power_train: 'AWD',
  fast_charge_kmh: 850,
  rapid_charge: 'Yes',
  plug_type: 'Type 2 CCS',
};

const renderWithRouter = (carId = '1') => {
  return render(
    <MemoryRouter initialEntries={[`/car/${carId}`]}>
      <Routes>
        <Route path="/car/:id" element={<CarDetail />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('CarDetail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when loading car details', () => {
    it('should show loading skeleton initially', () => {
      electricCarsAPI.getById.mockReturnValue(new Promise(() => {}));
      const { container } = renderWithRouter();

      const skeletons = container.querySelectorAll('.MuiSkeleton-root');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should display car information after loading', async () => {
      electricCarsAPI.getById.mockResolvedValue({ data: mockCar });
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('Tesla Model 3')).toBeInTheDocument();
      });

      // Price is formatted with German locale: 45.000 €
      expect(screen.getByText(/45\.000/i)).toBeInTheDocument();
      expect(screen.getByText(/500 km/i)).toBeInTheDocument();
    });

    it('should show error when car not found', async () => {
      electricCarsAPI.getById.mockRejectedValue(new Error('Not found'));
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText(/failed to fetch car details/i)).toBeInTheDocument();
      });
    });
  });

  describe('when displaying car specs', () => {
    it('should show general information card', async () => {
      electricCarsAPI.getById.mockResolvedValue({ data: mockCar });
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText(/general information/i)).toBeInTheDocument();
      });

      expect(screen.getByText('Tesla')).toBeInTheDocument();
      expect(screen.getByText('Model 3')).toBeInTheDocument();
    });

    it('should show performance details', async () => {
      electricCarsAPI.getById.mockResolvedValue({ data: mockCar });
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText(/performance/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/3.5 sec/i)).toBeInTheDocument();
      expect(screen.getByText(/225 km\/h/i)).toBeInTheDocument();
    });

    it('should show battery and charging info', async () => {
      electricCarsAPI.getById.mockResolvedValue({ data: mockCar });
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText(/battery & charging/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/850 km\/h/i)).toBeInTheDocument();
    });
  });

  describe('when navigating back', () => {
    it('should have back button', async () => {
      electricCarsAPI.getById.mockResolvedValue({ data: mockCar });
      renderWithRouter();

      await waitFor(() => {
        const backButtons = screen.getAllByText(/back to list/i);
        expect(backButtons.length).toBeGreaterThan(0);
      });
    });
  });
});
