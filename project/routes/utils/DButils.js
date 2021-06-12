require("dotenv").config();
const sql = require("mssql");

const config = {
  user:`admin--3`,
   password:`assignment3!`,
   server:`assignment--3.database.windows.net`,
   database:`football-management-group`,
 
  // user: process.env.tedious_userName,
  // password: process.env.tedious_password,
  // server: process.env.tedious_server,
  // TODO:
  // database: process.env.tedious_database,
  database: 'football-management-group',
  options: {
    encrypt: true,
    enableArithAbort: true
  }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

exports.execQuery = async function (query) {
  await poolConnect;
  try {
    var result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error("SQL error", err);
    throw err;
  }
};

exports.closeConnection = async function () {
  pool.close()
};


