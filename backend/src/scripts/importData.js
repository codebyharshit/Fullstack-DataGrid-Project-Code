const fs = require('fs');
const csv = require('csv-parser');
const mysql = require('mysql2/promise');

async function importCSVData() {
  // Create database connection
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'electric_cars_db',
    port: 3306
  });

  console.log('Connected to MySQL database');

  const results = [];
  const csvPath = '/Users/harshitagarwal/Fullstack-DataGrid-Project/backend/documents/BMW_Aptitude_Test_Test_Data_ElectricCarData.csv';

  // Read and parse CSV file
  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      console.log(`Total records to import: ${results.length}`);

      try {
        let imported = 0;
        for (const row of results) {
          // Parse date from MM/DD/YY format to YYYY-MM-DD
          const dateParts = row.Date.split('/');
          const year = parseInt(dateParts[2]) + 2000; // Assuming 20xx
          const month = dateParts[0].padStart(2, '0');
          const day = dateParts[1].padStart(2, '0');
          const formattedDate = `${year}-${month}-${day}`;

          const query = `
            INSERT INTO electric_cars
            (brand, model, accel_sec, top_speed_kmh, range_km, efficiency_whkm,
             fast_charge_kmh, rapid_charge, power_train, plug_type, body_style,
             segment, seats, price_euro, date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          const values = [
            row.Brand.trim(),
            row.Model.trim(),
            parseFloat(row.AccelSec),
            parseInt(row.TopSpeed_KmH),
            parseInt(row.Range_Km),
            parseInt(row.Efficiency_WhKm),
            parseInt(row.FastCharge_KmH),
            row.RapidCharge,
            row.PowerTrain,
            row.PlugType,
            row.BodyStyle,
            row.Segment,
            parseInt(row.Seats),
            parseFloat(row.PriceEuro),
            formattedDate
          ];

          await connection.execute(query, values);
          imported++;
        }

        console.log(`✅ Successfully imported ${imported} records!`);

        // Show sample data
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM electric_cars');
        console.log(`Total records in database: ${rows[0].count}`);

        const [sampleRows] = await connection.execute('SELECT * FROM electric_cars LIMIT 5');
        console.log('\nSample data:');
        console.table(sampleRows);

      } catch (error) {
        console.error('Error importing data:', error);
      } finally {
        await connection.end();
        console.log('\nDatabase connection closed');
      }
    });
}

importCSVData();
