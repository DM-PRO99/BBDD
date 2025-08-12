
CREATE DATABASE IF NOT EXISTS pd_Diego_mena_lovelace;
USE pd_Diego_mena_lovelace;

-- Clients
CREATE TABLE IF NOT EXISTS clients (
  client_id INT AUTO_INCREMENT PRIMARY KEY,
  identification VARCHAR(100) UNIQUE,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(100),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

--  Table for Platforms
CREATE TABLE IF NOT EXISTS platforms (
  platform_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Table for Invoices
CREATE TABLE IF NOT EXISTS invoices (
  invoice_id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(100) NOT NULL UNIQUE,
  client_id INT,
  period VARCHAR(20),
  amount DECIMAL(15,2),
  paid_amount DECIMAL(15,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE SET NULL
) ENGINE=InnoDB;


-- Table for Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  external_transaction_id VARCHAR(100),
  datetime DATETIME,
  amount DECIMAL(15,2),
  status VARCHAR(100),
  type VARCHAR(100),
  client_id INT,
  invoice_id INT,
  platform_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE SET NULL,
  FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE SET NULL,
  FOREIGN KEY (platform_id) REFERENCES platforms(platform_id) ON DELETE SET NULL
) ENGINE=InnoDB;