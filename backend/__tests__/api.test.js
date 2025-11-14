const request = require('supertest');
const express = require('express');
const electricCarsRoutes = require('../src/routes/electricCarsRoutes');

const app = express();
app.use(express.json());
app.use('/api/electric-cars', electricCarsRoutes);

jest.mock('../src/config/database', () => ({
  query: jest.fn(),
}));

const db = require('../src/config/database');

describe('Electric Cars API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when fetching all cars', () => {
    it('should return list of cars successfully', async () => {
      const mockCars = [
        { id: 1, brand: 'Tesla', model: 'Model 3', price_euro: 45000 },
        { id: 2, brand: 'BMW', model: 'i4', price_euro: 55000 },
      ];

      // Mock the COUNT query first, then the SELECT query
      db.query
        .mockResolvedValueOnce([[{ total: 2 }]])
        .mockResolvedValueOnce([mockCars]);

      const response = await request(app).get('/api/electric-cars');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.pagination.total).toBe(2);
      expect(response.body.data).toEqual(mockCars);
    });

    it('should handle database errors gracefully', async () => {
      db.query.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app).get('/api/electric-cars');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Error fetching data');
    });
  });

  describe('when getting a specific car', () => {
    it('should return car details when found', async () => {
      const mockCar = { id: 1, brand: 'Tesla', model: 'Model 3', price_euro: 45000 };
      db.query.mockResolvedValue([[mockCar]]);

      const response = await request(app).get('/api/electric-cars/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockCar);
    });

    it('should return 404 when car doesnt exist', async () => {
      db.query.mockResolvedValue([[]]);

      const response = await request(app).get('/api/electric-cars/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Electric car not found');
    });
  });

  describe('when deleting a car', () => {
    it('should delete car successfully', async () => {
      db.query.mockResolvedValue([{ affectedRows: 1 }]);

      const response = await request(app).delete('/api/electric-cars/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Electric car deleted successfully');
    });

    it('should return 404 when trying to delete non-existent car', async () => {
      db.query.mockResolvedValue([{ affectedRows: 0 }]);

      const response = await request(app).delete('/api/electric-cars/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('when searching for cars', () => {
    it('should find cars matching the search query', async () => {
      const mockResults = [
        { id: 1, brand: 'Tesla', model: 'Model 3' },
        { id: 2, brand: 'Tesla', model: 'Model Y' },
      ];
      db.query.mockResolvedValue([mockResults]);

      const response = await request(app).get('/api/electric-cars/search/query?q=Tesla');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toEqual(mockResults);
    });

    it('should return empty results when nothing matches', async () => {
      db.query.mockResolvedValue([[]]);

      const response = await request(app).get('/api/electric-cars/search/query?q=NonExistent');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
    });

    it('should reject requests without search query', async () => {
      const response = await request(app).get('/api/electric-cars/search/query');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Search query is required');
    });
  });

  describe('when filtering cars', () => {
    it('should apply filters correctly', async () => {
      const mockResults = [
        { id: 1, brand: 'Tesla', price_euro: 45000 },
      ];
      db.query.mockResolvedValue([mockResults]);

      const filters = [
        { field: 'brand', operator: 'contains', value: 'Tesla' },
        { field: 'price_euro', operator: 'lessThan', value: '50000' },
      ];

      const response = await request(app)
        .post('/api/electric-cars/filter')
        .send({ filters });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockResults);
    });

    it('should handle empty filter results', async () => {
      db.query.mockResolvedValue([[]]);

      const filters = [
        { field: 'price_euro', operator: 'greaterThan', value: '100000' },
      ];

      const response = await request(app)
        .post('/api/electric-cars/filter')
        .send({ filters });

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(0);
    });

    it('should reject requests with invalid filters', async () => {
      const response = await request(app)
        .post('/api/electric-cars/filter')
        .send({ filters: [] });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should handle isEmpty operator correctly', async () => {
      const mockResults = [{ id: 1, brand: 'Tesla', rapid_charge: null }];
      db.query.mockResolvedValue([mockResults]);

      const filters = [
        { field: 'rapid_charge', operator: 'isEmpty', value: '' },
      ];

      const response = await request(app)
        .post('/api/electric-cars/filter')
        .send({ filters });

      expect(response.status).toBe(200);
      expect(db.query).toHaveBeenCalled();
    });
  });

  describe('when handling various filter operators', () => {
    beforeEach(() => {
      db.query.mockResolvedValue([[]]);
    });

    it('should handle equals operator', async () => {
      const filters = [{ field: 'brand', operator: 'equals', value: 'Tesla' }];
      await request(app).post('/api/electric-cars/filter').send({ filters });
      expect(db.query).toHaveBeenCalled();
    });

    it('should handle startsWith operator', async () => {
      const filters = [{ field: 'brand', operator: 'startsWith', value: 'Te' }];
      await request(app).post('/api/electric-cars/filter').send({ filters });
      expect(db.query).toHaveBeenCalled();
    });

    it('should handle endsWith operator', async () => {
      const filters = [{ field: 'brand', operator: 'endsWith', value: 'sla' }];
      await request(app).post('/api/electric-cars/filter').send({ filters });
      expect(db.query).toHaveBeenCalled();
    });

    it('should handle greaterThanOrEqual operator', async () => {
      const filters = [{ field: 'price_euro', operator: 'greaterThanOrEqual', value: '40000' }];
      await request(app).post('/api/electric-cars/filter').send({ filters });
      expect(db.query).toHaveBeenCalled();
    });

    it('should handle lessThanOrEqual operator', async () => {
      const filters = [{ field: 'price_euro', operator: 'lessThanOrEqual', value: '60000' }];
      await request(app).post('/api/electric-cars/filter').send({ filters });
      expect(db.query).toHaveBeenCalled();
    });
  });
});
