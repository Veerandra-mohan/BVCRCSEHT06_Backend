const sql = require('mssql');

// SQL Server configuration for Windows Authentication
const config = {
  server: 'localhost',
  database: 'HackathonDB',
  driver: 'msnodesqlv8', // Required for Windows Authentication
  options: {
    trustedConnection: true // Use Windows Authentication
  }
};

// Create a connection pool
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL');
    return pool;
  })
  .catch(err => console.error('Database Connection Failed! Bad Config: ', err));

module.exports = {
  sql,
  poolPromise
};