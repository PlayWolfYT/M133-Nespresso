const mysql = require("mysql");
const path = require("path");
const fs = require("fs");

const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
});

async function query(query, callback = undefined) {
  return new Promise((resolve, reject) => {
    // Open a connection to the database
    dbPool.getConnection((err, connection) => {
      if (err) {
        console.log("FATAL ERROR: Could not open Database Connection.");
        reject();
        return;
      }

      connection.query(query, (err, rows, fields) => {
        // Terminate Database connection after query
        connection.release();

        let callbackResponse = undefined;

        // Trigger the callback (if we have one)
        if (callback) callbackResponse = callback(err, rows, fields);

        resolve(err, rows, fields, callbackResponse);
      });
    });
  });
}

async function queryFile(filepath, callback = undefined) {
  return new Promise((resolve) => {
    const queryString = fs.readFileSync(filepath).toString();
    query(queryString, callback);
    resolve();
  });
}

async function setupTableStructures() {
  return new Promise((resolve, reject) => {
    queryFile(
      path.join(__dirname, "sql_files/database_structure.sql"),
      (err) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }

        resolve();
      }
    );
  });
}

async function setupTableDefaults() {
  return new Promise((resolve, reject) => {
    queryFile(
      path.join(__dirname, "sql_files/database_defaults.sql"),
      (err) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }

        resolve();
      }
    );
  });
}

async function setupDatabase() {
  /***********    DATABASE SETUP    ************/
  return new Promise((resolve, reject) => {
    try {
      setupTableStructures();
      setupTableDefaults();
      resolve();
    } catch (e) {
      reject();
    }
  });
}

module.exports = {
  setupDatabase,
  query,
};
