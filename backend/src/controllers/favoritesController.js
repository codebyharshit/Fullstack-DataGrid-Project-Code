const db = require('../config/database');

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get all favorited cars for the user
 *     tags: [Favorites]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           default: default_user
 *         description: User identifier
 *     responses:
 *       200:
 *         description: List of favorited cars
 */
const getFavorites = async (req, res) => {
  try {
    const userId = req.query.userId || 'default_user';

    const [rows] = await db.query(
      `SELECT ec.*, f.created_at as favorited_at
       FROM favorites f
       INNER JOIN electric_cars ec ON f.car_id = ec.id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching favorites',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/favorites/{carId}:
 *   post:
 *     summary: Add a car to favorites
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Car ID to favorite
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           default: default_user
 *         description: User identifier
 *     responses:
 *       201:
 *         description: Car added to favorites
 *       409:
 *         description: Car already in favorites
 */
const addFavorite = async (req, res) => {
  try {
    const { carId } = req.params;
    const userId = req.query.userId || 'default_user';

    const [existing] = await db.query(
      'SELECT * FROM favorites WHERE car_id = ? AND user_id = ?',
      [carId, userId]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Car is already in favorites'
      });
    }

    await db.query(
      'INSERT INTO favorites (car_id, user_id) VALUES (?, ?)',
      [carId, userId]
    );

    res.status(201).json({
      success: true,
      message: 'Car added to favorites successfully'
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding favorite',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/favorites/{carId}:
 *   delete:
 *     summary: Remove a car from favorites
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Car ID to unfavorite
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           default: default_user
 *         description: User identifier
 *     responses:
 *       200:
 *         description: Car removed from favorites
 *       404:
 *         description: Favorite not found
 */
const removeFavorite = async (req, res) => {
  try {
    const { carId } = req.params;
    const userId = req.query.userId || 'default_user';

    const [result] = await db.query(
      'DELETE FROM favorites WHERE car_id = ? AND user_id = ?',
      [carId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    res.json({
      success: true,
      message: 'Car removed from favorites successfully'
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing favorite',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/favorites/check/{carId}:
 *   get:
 *     summary: Check if a car is favorited
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Car ID to check
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           default: default_user
 *         description: User identifier
 *     responses:
 *       200:
 *         description: Favorite status
 */
const checkFavorite = async (req, res) => {
  try {
    const { carId } = req.params;
    const userId = req.query.userId || 'default_user';

    const [rows] = await db.query(
      'SELECT * FROM favorites WHERE car_id = ? AND user_id = ?',
      [carId, userId]
    );

    res.json({
      success: true,
      isFavorite: rows.length > 0
    });
  } catch (error) {
    console.error('Error checking favorite:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking favorite status',
      error: error.message
    });
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
};
