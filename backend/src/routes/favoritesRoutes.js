const express = require('express');
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} = require('../controllers/favoritesController');

router.get('/', getFavorites);
router.get('/check/:carId', checkFavorite);
router.post('/:carId', addFavorite);
router.delete('/:carId', removeFavorite);

module.exports = router;
