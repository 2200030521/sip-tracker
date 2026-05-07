import db from '../config/db.js';

export function createSipFromDB(data) {
  return new Promise((resolve, reject) => {
    const {investor_id,portfolio_id,fund_id,sip_amount,sip_date,start_date} = data;
    db.run(
      `INSERT INTO sips (investor_id,portfolio_id,fund_id,sip_amount,sip_date,start_date,status) VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')`,
      [investor_id, portfolio_id, fund_id, sip_amount, sip_date, start_date],
      function (err) {
        if (err) reject(err);
        else resolve({ sip_id: this.lastID });
      }
    );
  });
}

export function getSipByIdFromDB(sip_id) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM sips WHERE sip_id = ?`,
      [sip_id],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
}

export function processSipFromDB(sip_id) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM sips WHERE sip_id = ?`, [sip_id], (err, sip) => {
      if (err) return reject(err);
      db.get(
        `SELECT latest_nav FROM mutual_funds WHERE fund_id = ?`,
        [sip.fund_id],
        (err2, fund) => {
          if (err2) return reject(err2);
          const units = sip.sip_amount / fund.latest_nav;
          db.run(
            `INSERT INTO investment_transactions
            (sip_id, investor_id, fund_id, nav, amount, units_allocated, transaction_date, transaction_type)
            VALUES (?, ?, ?, ?, ?, ?, DATE('now'), 'SIP')`,
            [sip.sip_id,sip.investor_id,sip.fund_id,fund.latest_nav,sip.sip_amount,units],
            function (err) {
              if (err) reject(err);
              else resolve({ message: 'SIP processed' });
            }
          );
        }
      );
    });
  });
}

export function getSipTransactionsFromDB(sip_id) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM investment_transactions WHERE sip_id = ?`,
      [sip_id],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}