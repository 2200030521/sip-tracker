import db from '../config/db.js'
export function addFundFromDB(data) {
  return new Promise((resolve, reject) => {
    const { amc_id, fund_name, fund_type, category, latest_nav } = data;

    db.run(
      `INSERT INTO mutual_funds (amc_id, fund_name, fund_type, category, latest_nav)
       VALUES (?, ?, ?, ?, ?)`,
      [amc_id, fund_name, fund_type, category, latest_nav],
      function (err) {
        if (err) {
          reject({ error: err.message, message: 'Error adding fund' });
        } else {
          resolve({ message: 'Fund added successfully', fund_id: this.lastID });
        }
      }
    );
  });
}

export function getFundsFromDB() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT mf.*, a.amc_name
       FROM mutual_funds mf
       JOIN amcs a ON mf.amc_id = a.amc_id`,
      [],
      (err, rows) => {
        if (err) {
          reject({ error: err.message });
        } else {
          resolve(rows);
        }
      }
    );
  });
}
export function updateFundNAVFromDB(fundId, latest_nav) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE mutual_funds
       SET latest_nav = ?, updated_at = CURRENT_TIMESTAMP
       WHERE fund_id = ?`,
      [latest_nav, fundId],
      function (err) {
        if (err) {
          reject({ error: err.message });
        } else {
          //console.log(latest_nav+" "+fundId);
          resolve({ message: 'NAV updated' });
        }
      }
    );
  });
}