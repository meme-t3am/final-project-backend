const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 
    process.env[
      process.env.NODE_ENV === 'test' 
        ? 'TEST_DATABASE_URL' 
        : 'DATABASE_URL'
    ],
  ssl: process.env.PGSSLMODE && { rejectUnauthorized: false },
});
  
// eslint-disable-next-line no-console
pool.on('connect', () => console.log('🐘 Postgres connected'));
module.exports = pool;
