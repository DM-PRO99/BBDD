-- Example LOAD DATA commands (run in MySQL client)
-- Make sure the database 'pd_Diego_mena_lovelace' exists and tables are created by running database.sql first.
-- Adjust the file paths to where you placed the CSVs on the MySQL server machine.

LOAD DATA LOCAL INFILE 'csvs/clients.csv' INTO TABLE clients
FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 LINES
(identification,name,address,phone,email);

LOAD DATA LOCAL INFILE 'csvs/platforms.csv' INTO TABLE platforms
FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 LINES
(platform_id,platform_name);

-- For invoices and transactions it's recommended to use a script that maps client_id correctly, 
-- because invoices CSV already includes client_id values compatible with the generated dataset in this package.