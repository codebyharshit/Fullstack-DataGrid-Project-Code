const express = require('express');
const router = express.Router();
const {
  getAllCars,
  getCarById,
  deleteCar,
  searchCars,
  filterCars,
  exportToCSV,
  exportToExcel,
} = require('../controllers/electricCarsController');

router.get('/', getAllCars);
router.get('/search/query', searchCars);
router.post('/filter', filterCars);
router.get('/export/csv', exportToCSV);
router.get('/export/excel', exportToExcel);
router.get('/:id', getCarById);
router.delete('/:id', deleteCar);

module.exports = router;
