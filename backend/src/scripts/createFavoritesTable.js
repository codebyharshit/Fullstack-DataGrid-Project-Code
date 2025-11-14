require('dotenv').config();
const db = require('../config/database');

const createFavoritesTable = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        car_id INT NOT NULL,
        user_id VARCHAR(255) DEFAULT 'default_user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_favorite (car_id, user_id),
        FOREIGN KEY (car_id) REFERENCES electric_cars(id) ON DELETE CASCADE
      )
    `;

    await db.query(createTableQuery);
    console.log('Favorites table created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating favorites table:', error);
    process.exit(1);
  }
};

createFavoritesTable();
