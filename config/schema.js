import db from './db.js';

const createTables = () => {
  db.serialize(() => {

    db.run(`PRAGMA foreign_keys = ON`);

    db.run(`
      CREATE TABLE IF NOT EXISTS investors (
        investor_id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT,
        email TEXT UNIQUE NOT NULL,
        phone TEXT UNIQUE,
        pan_number TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP 
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS portfolios (
        portfolio_id INTEGER PRIMARY KEY AUTOINCREMENT,
        investor_id INTEGER,
        portfolio_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (investor_id)
        REFERENCES investors(investor_id)
        ON DELETE CASCADE
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS amcs (
        amc_id INTEGER PRIMARY KEY AUTOINCREMENT,
        amc_name TEXT,
        amc_code TEXT UNIQUE
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS mutual_funds (
        fund_id INTEGER PRIMARY KEY AUTOINCREMENT,
        amc_id INTEGER,
        fund_name TEXT,
        fund_type TEXT,
        category TEXT,
        latest_nav REAL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (amc_id)
        REFERENCES amcs(amc_id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS sips (
        sip_id INTEGER PRIMARY KEY AUTOINCREMENT,
        investor_id INTEGER,
        portfolio_id INTEGER,
        fund_id INTEGER,
        sip_amount REAL,
        sip_date INTEGER,
        start_date DATE,
        status TEXT CHECK(status IN ('ACTIVE','PAUSED','STOPPED')) DEFAULT 'ACTIVE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (investor_id)
          REFERENCES investors(investor_id),
        FOREIGN KEY (portfolio_id)
          REFERENCES portfolios(portfolio_id),
        FOREIGN KEY (fund_id)
          REFERENCES mutual_funds(fund_id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS investment_transactions (
        transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
        sip_id INTEGER,
        investor_id INTEGER,
        fund_id INTEGER,
        nav REAL,
        amount REAL,
        units_allocated REAL,
        transaction_date DATE,
        transaction_type TEXT CHECK(transaction_type IN ('SIP','LUMPSUM')),
        FOREIGN KEY (sip_id)
          REFERENCES sips(sip_id),
        FOREIGN KEY (investor_id)
          REFERENCES investors(investor_id),
        FOREIGN KEY (fund_id)
          REFERENCES mutual_funds(fund_id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

  });
};

export default createTables;