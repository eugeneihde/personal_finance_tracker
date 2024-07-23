CREATE DATABASE IF NOT EXISTS finance_tracker;

USE finance_tracker;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  displayName VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  currency ENUM('euro', 'dollar') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Default User
INSERT IGNORE INTO users (id, displayName, username, password, currency) VALUES (1000, "Admin Test User", "admin", "$2a$10$ebDEB0S2Iqx8CCTrA5eKs.aa6sJHrT/Ec7KDeHThm8D5ivGsV.aiW", 'euro');

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  amount FLOAT NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Test Transaction-Data
INSERT IGNORE INTO transactions (user_id, title, date, amount, type) VALUES
(1000, 'Salary', '2024-07-01', 3000.00, 'income'),
(1000, 'Rent', '2024-07-02', 1200.00, 'expense'),
(1000, 'Grocery Shopping', '2024-07-03', 150.75, 'expense'),
(1000, 'Electricity Bill', '2024-07-04', 80.50, 'expense'),
(1000, 'Internet Bill', '2024-07-05', 50.00, 'expense'),
(1000, 'Freelance Work', '2024-07-06', 500.00, 'income'),
(1000, 'Dinner Out', '2024-07-07', 60.00, 'expense'),
(1000, 'Public Transport', '2024-07-08', 25.00, 'expense'),
(1000, 'Coffee', '2024-07-09', 10.00, 'expense'),
(1000, 'Movie Night', '2024-07-10', 20.00, 'expense'),
(1000, 'Book Purchase', '2024-07-11', 15.00, 'expense'),
(1000, 'Gym Membership', '2024-07-12', 45.00, 'expense'),
(1000, 'Gift Purchase', '2024-07-13', 70.00, 'expense'),
(1000, 'Bonus', '2024-07-14', 800.00, 'income'),
(1000, 'Car Repair', '2024-07-15', 250.00, 'expense'),
(1000, 'Clothing Purchase', '2024-07-16', 100.00, 'expense'),
(1000, 'Savings Deposit', '2024-07-17', 500.00, 'expense'),
(1000, 'Dividends', '2024-07-18', 200.00, 'income'),
(1000, 'Lunch', '2024-07-19', 12.00, 'expense'),
(1000, 'Concert Ticket', '2024-07-20', 90.00, 'expense'),
(1000, 'Health Insurance', '2024-07-21', 150.00, 'expense'),
(1000, 'Work Travel Reimbursement', '2024-07-22', 300.00, 'income'),
(1000, 'New Phone Purchase', '2024-07-23', 800.00, 'expense'),
(1000, 'Groceries', '2024-07-24', 175.00, 'expense'),
(1000, 'Dinner with Friends', '2024-07-25', 65.00, 'expense'),
(1000, 'Monthly Subscription', '2024-07-26', 15.00, 'expense'),
(1000, 'Lottery Winnings', '2024-07-27', 50.00, 'income'),
(1000, 'Parking Fee', '2024-07-28', 8.00, 'expense'),
(1000, 'Bus Ticket', '2024-07-29', 3.00, 'expense'),
(1000, 'Investment Income', '2024-07-30', 400.00, 'income');

-- Recurring Transactions Table
CREATE TABLE IF NOT EXISTS recurring_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  amount FLOAT NOT NULL,
  frequency ENUM('daily', 'weekly', 'monthly', 'yearly') NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);