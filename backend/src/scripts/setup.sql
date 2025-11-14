-- Create database
CREATE DATABASE IF NOT EXISTS electric_cars_db;

-- Use the database
USE electric_cars_db;

-- Create electric cars table
CREATE TABLE IF NOT EXISTS electric_cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(100),
    model VARCHAR(100),
    accel_sec DECIMAL(4,2),
    top_speed_kmh INT,
    range_km INT,
    efficiency_whkm INT,
    fast_charge_kmh INT,
    rapid_charge VARCHAR(10),
    power_train VARCHAR(20),
    plug_type VARCHAR(50),
    body_style VARCHAR(50),
    segment VARCHAR(10),
    seats INT,
    price_euro DECIMAL(10,2),
    date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_brand ON electric_cars(brand);
CREATE INDEX idx_model ON electric_cars(model);
CREATE INDEX idx_price ON electric_cars(price_euro);
CREATE INDEX idx_range ON electric_cars(range_km);
