const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://carelink:carelink@127.0.0.1:5433/carelink?schema=public' });
client.connect()
  .then(() => {
    console.log('Connected to DB successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('DB connection error:', err);
    process.exit(1);
  });
