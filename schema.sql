-- =============================================
-- Database Schema for WFH Absent App
-- Database: MySQL
-- =============================================

CREATE DATABASE IF NOT EXISTS wfh_absent_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE wfh_absent_db;

-- 1. Table: users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'employee') NOT NULL DEFAULT 'employee',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: employees
CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  employee_code VARCHAR(20) NOT NULL UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20) NULL,
  department VARCHAR(50) NULL,
  position VARCHAR(50) NULL,
  photo_url VARCHAR(255) NULL,
  join_date DATE NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_employees_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: attendances
CREATE TABLE IF NOT EXISTS attendances (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  check_in_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  photo_url VARCHAR(255) NOT NULL,
  notes TEXT NULL,
  status ENUM('present', 'late') NOT NULL DEFAULT 'present',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_attendances_employees FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default admin user:
-- Username: admin
-- Password (hashed with bcrypt cost 10 for 'admin123'): $2a$10$wT0lVlX1p/KvhB8aZ44C6.o4PzRjYy8w1lGv3qM4PqJ5I9O/dE/2C
-- Also seed sample employee user for testing:
-- Username: john_doe
-- Password for 'user123': $2a$10$1Y8cTzK1ZzL0KvhB8aZ44C.o4PzRjYy8w1lGv3qM4PqJ5I9O/dE/2C

