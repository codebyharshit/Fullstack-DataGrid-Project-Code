# Electric Cars Data Grid - Full Stack Application

A modern full-stack web application for browsing, searching, and comparing electric cars. This project features a powerful data grid interface with advanced filtering, search capabilities, and detailed car comparisons.

## What This Project Does

This application helps users explore and compare electric vehicles by providing:

- **Browse Electric Cars**: View a comprehensive list of electric vehicles with all their specifications
- **Advanced Search**: Search for cars by brand, model, body style, segment, or power train
- **Smart Filtering**: Apply multiple filters with various operators (contains, equals, starts with, etc.)
- **Compare Vehicles**: Side-by-side comparison of multiple electric cars
- **Detailed Views**: See complete specifications including performance, battery, and charging information
- **Export Data**: Download the data in CSV or Excel format for offline analysis

## Technologies Used

### Backend
- **Node.js & Express** - Server framework
- **MySQL** - Database for storing car data
- **Swagger** - API documentation
- **Jest** - Testing framework
- **Additional Libraries**:
  - `cors` - Cross-origin resource sharing
  - `dotenv` - Environment variable management
  - `json2csv` & `exceljs` - Data export functionality

### Frontend
- **React 19** - User interface framework
- **Material-UI (MUI)** - Modern UI components and icons
- **AG Grid** - Advanced data grid component
- **React Router** - Navigation and routing
- **Axios** - HTTP client for API calls
- **Vitest** - Testing framework

## Project Structure

```
Fullstack-DataGrid-Project/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── app.js          # Express app configuration
│   │   ├── server.js       # Server entry point
│   │   ├── config/         # Database and Swagger config
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API route definitions
│   │   ├── middleware/     # Custom middleware
│   │   └── scripts/        # Database setup scripts
│   ├── __tests__/          # Backend tests
│   ├── .env                # Environment variables
│   └── package.json
│
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   └── __tests__/      # Frontend tests
│   └── package.json
│
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Features in Detail

### 1. Data Grid with AG Grid
- High-performance grid capable of handling large datasets
- Column sorting and resizing
- Row selection for comparison
- Responsive design for all screen sizes

### 2. Search Functionality
Search across multiple fields including:
- Car brand
- Model name
- Body style
- Segment
- Power train type

### 3. Advanced Filtering
Apply filters with multiple operators:
- **Text Operators**: contains, equals, starts with, ends with, is empty
- **Number Operators**: greater than, less than, greater than or equal, less than or equal
- **Multiple Filters**: Combine multiple conditions for precise results

### 4. Car Comparison
- Select up to multiple cars from the grid
- View side-by-side comparison with:
  - Price comparison
  - Performance metrics (acceleration, top speed)
  - Battery and range information
  - Charging specifications
  - Visual indicators for best values

### 5. Detailed Car View
Each car has a dedicated page showing:
- General information (brand, model, body style, seats)
- Performance details (acceleration, top speed, power train)
- Battery and charging specs (range, efficiency, fast charging)
- Beautiful card-based layout with icons

### 6. Data Export
Export the complete dataset to:
- **CSV format** - For spreadsheet applications
- **Excel format** - With formatted headers and styling

## API Endpoints

### Electric Cars API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/electric-cars` | Get all electric cars with pagination |
| GET | `/api/electric-cars/:id` | Get a specific car by ID |
| GET | `/api/electric-cars/search/query?q=tesla` | Search cars by query string |
| POST | `/api/electric-cars/filter` | Filter cars with advanced criteria |
| DELETE | `/api/electric-cars/:id` | Delete a car record |
| GET | `/api/electric-cars/export/csv` | Export data to CSV |
| GET | `/api/electric-cars/export/excel` | Export data to Excel |

### API Documentation
Interactive API documentation is available at `http://localhost:5001/api-docs` when the backend server is running.

## How to Run This Project

### Prerequisites
Before you begin, make sure you have installed:
- **Node.js** (version 14 or higher)
- **MySQL** (version 5.7 or higher)
- **npm** (comes with Node.js)

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd Fullstack-DataGrid-Project
```

### Step 2: Set Up the Database

1. Create a MySQL database:
```sql
CREATE DATABASE electric_cars_db;
```

2. Run the setup script:
```bash
cd backend/src/scripts
mysql -u root -p electric_cars_db < setup.sql
```

3. (Optional) Import sample data:
```bash
cd backend
node src/scripts/importData.js
```

### Step 3: Configure Backend

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your database credentials:
```
PORT=5001

# Database Configuration
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=electric_cars_db
DB_PORT=3306
```

4. Start the backend server:
```bash
npm start          # Production mode
# OR
npm run dev        # Development mode with auto-reload
```

The backend will start on `http://localhost:5001`

### Step 4: Configure Frontend

1. Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

### Step 5: Access the Application

Open your browser and go to `http://localhost:5173`

You should see the electric cars data grid with all the features working!

## Running Tests

### Backend Tests
```bash
cd backend
npm test              # Run all tests with coverage
npm run test:watch    # Run tests in watch mode
```

**Test Coverage:**
- API endpoint testing
- Database operations
- Error handling
- Filter and search functionality

### Frontend Tests
```bash
cd frontend
npm test              # Run all tests with coverage
npm run test:watch    # Run tests in watch mode
```

**Test Coverage:**
- Component rendering
- User interactions
- API integration
- Search and filter functionality
- Comparison and detail pages

## Development Scripts

### Backend
```bash
npm start              # Start the server
npm run dev            # Start with nodemon (auto-reload)
npm test              # Run tests with coverage
npm run setup:favorites  # Create favorites table
```

### Frontend
```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run preview       # Preview production build
npm test             # Run tests
npm run lint         # Run ESLint
```

## Key Features Explained

### Quick Filters (Frontend)
The data grid includes quick filter buttons for common searches:
- Filter by body style (Sedan, SUV, Hatchback, etc.)
- Filter by price range
- Filter by range capacity

### Pagination
The backend API supports pagination for efficient data loading:
- Default: 50 records per page
- Customizable page size
- Includes total count and page information

### Error Handling
Both frontend and backend include comprehensive error handling:
- User-friendly error messages
- Console logging for debugging
- Graceful fallbacks for failed operations

## Database Schema

The `electric_cars` table includes:
- Basic info: brand, model, price_euro
- Performance: accel_sec, top_speed_kmh, power_train
- Battery: range_km, efficiency_whkm
- Charging: fast_charge_kmh, rapid_charge, plug_type
- Specifications: body_style, segment, seats

## Troubleshooting

### Backend won't start
- Check if MySQL is running
- Verify database credentials in `.env`
- Make sure port 5001 is not in use
- Run `npm install` to ensure all dependencies are installed

### Frontend shows "Failed to fetch data"
- Make sure the backend server is running on port 5001
- Check browser console for CORS errors
- Verify the API URL in `frontend/src/services/api.js`

### Database connection errors
- Confirm MySQL is running: `mysql -u root -p`
- Check database exists: `SHOW DATABASES;`
- Verify credentials in `.env` file

### Tests failing
- Make sure all dependencies are installed
- For frontend: Clear the node_modules and reinstall
- For backend: Check if the test database is accessible

## Future Enhancements

Potential features that could be added:
- User authentication and favorites
- Price alerts and notifications
- Dealer locator integration
- Electric charging station finder
- Vehicle comparison history
- Advanced analytics and charts
- Mobile app version

## Contributing

This is a learning/portfolio project. Feel free to fork and modify as needed!

## License

This project is open source and available for educational purposes.
