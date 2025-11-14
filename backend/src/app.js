const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const electricCarsRoutes = require('./routes/electricCarsRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Electric Cars API Documentation',
}));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Electric Cars API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.use('/api/electric-cars', electricCarsRoutes);
app.use('/api/favorites', favoritesRoutes);

app.use(errorHandler);

module.exports = app;
