const db = require('../config/database');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');

/**
 * @swagger
 * /api/electric-cars:
 *   get:
 *     summary: Get all electric cars with pagination
 *     tags: [Cars]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of electric cars
 */
const getAllCars = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM electric_cars');
    const [rows] = await db.query('SELECT * FROM electric_cars ORDER BY id LIMIT ? OFFSET ?', [limit, offset]);

    res.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching electric cars:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching data',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/electric-cars/{id}:
 *   get:
 *     summary: Get a specific car by ID
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Car ID
 *     responses:
 *       200:
 *         description: Car details
 *       404:
 *         description: Car not found
 */
const getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM electric_cars WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Electric car not found'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching electric car:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching data',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/electric-cars/{id}:
 *   delete:
 *     summary: Delete a car
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Car ID
 *     responses:
 *       200:
 *         description: Car deleted successfully
 *       404:
 *         description: Car not found
 */
const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM electric_cars WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Electric car not found'
      });
    }

    res.json({
      success: true,
      message: 'Electric car deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting electric car:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting data',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/electric-cars/search/query:
 *   get:
 *     summary: Search for cars
 *     tags: [Cars]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Search results
 *       400:
 *         description: Missing search query
 */
const searchCars = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchQuery = `%${q}%`;
    const [rows] = await db.query(
      `SELECT * FROM electric_cars
       WHERE brand LIKE ?
       OR model LIKE ?
       OR body_style LIKE ?
       OR segment LIKE ?
       OR power_train LIKE ?
       ORDER BY id`,
      [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery]
    );

    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error searching electric cars:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching data',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/electric-cars/filter:
 *   post:
 *     summary: Filter cars with advanced criteria
 *     tags: [Cars]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filters:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     field:
 *                       type: string
 *                     operator:
 *                       type: string
 *                     value:
 *                       type: string
 *     responses:
 *       200:
 *         description: Filtered results
 */
const filterCars = async (req, res) => {
  try {
    const { filters } = req.body;

    if (!filters || !Array.isArray(filters) || filters.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Filters array is required'
      });
    }

    let query = 'SELECT * FROM electric_cars WHERE 1=1';
    const params = [];

    filters.forEach(filter => {
      const { field, operator, value } = filter;

      switch (operator) {
        case 'contains':
          query += ` AND ${field} LIKE ?`;
          params.push(`%${value}%`);
          break;
        case 'equals':
          query += ` AND ${field} = ?`;
          params.push(value);
          break;
        case 'startsWith':
          query += ` AND ${field} LIKE ?`;
          params.push(`${value}%`);
          break;
        case 'endsWith':
          query += ` AND ${field} LIKE ?`;
          params.push(`%${value}`);
          break;
        case 'isEmpty':
          query += ` AND (${field} IS NULL OR ${field} = '')`;
          break;
        case 'greaterThan':
          query += ` AND ${field} > ?`;
          params.push(value);
          break;
        case 'lessThan':
          query += ` AND ${field} < ?`;
          params.push(value);
          break;
        case 'greaterThanOrEqual':
          query += ` AND ${field} >= ?`;
          params.push(value);
          break;
        case 'lessThanOrEqual':
          query += ` AND ${field} <= ?`;
          params.push(value);
          break;
        default:
          break;
      }
    });

    query += ' ORDER BY id';

    const [rows] = await db.query(query, params);

    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error filtering electric cars:', error);
    res.status(500).json({
      success: false,
      message: 'Error filtering data',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/electric-cars/export/csv:
 *   get:
 *     summary: Export cars data to CSV
 *     tags: [Export]
 *     responses:
 *       200:
 *         description: CSV file
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 */
const exportToCSV = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM electric_cars ORDER BY id');

    const fields = Object.keys(rows[0] || {});
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(rows);

    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename=electric_cars.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting data',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/electric-cars/export/excel:
 *   get:
 *     summary: Export cars data to Excel
 *     tags: [Export]
 *     responses:
 *       200:
 *         description: Excel file
 */
const exportToExcel = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM electric_cars ORDER BY id');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Electric Cars');

    if (rows.length > 0) {
      worksheet.columns = Object.keys(rows[0]).map(key => ({
        header: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
        key: key,
        width: 15
      }));

      worksheet.addRows(rows);

      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF667eea' }
      };
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=electric_cars.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting data',
      error: error.message
    });
  }
};

module.exports = {
  getAllCars,
  getCarById,
  deleteCar,
  searchCars,
  filterCars,
  exportToCSV,
  exportToExcel,
};
