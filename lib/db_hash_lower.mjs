// Build db table and import data,

import { Command } from 'commander';
import pg from 'pg';
const program = new Command();
const { Pool, types } = pg;

function parseArgs(){
  console.log('process.argv', process.argv)
  program
    .option('-h, --host <char>', 'db host', 'db')
    .option('-p, --port <number>', 'db port', 5432)
    .option('-u, --user <char>', 'db user', 'postgres')
    .option('-w, --password <char>', 'db password', 'postgres')
    .option('-d, --dbname <char>', 'db name', 'lenticsdb')
    .parse(process.argv);
  return program.opts()
}

async function main() {
  let {
    host,
    port,
    user,
    password,
    dbname
  } =  parseArgs();
  
  const dbPool = new Pool({
    host: host,
    port: port,
    user: user,
    password: password,
    database: dbname
  });
  let client = await dbPool.connect();
  let getTables = await client.query(`SELECT tablename FROM "pg_tables"
    WHERE "tablename" NOT LIKE 'pg%'
    AND "tablename" NOT LIKE 'sql_%'`);
  for (const [index, row] of getTables.rows.entries()) {
    console.log(`${index+1}/${getTables.rows.length}, process ${row.tablename}...`);
    let result = await client.query(`SELECT * FROM ${row.tablename} LIMIT 1;`);
    if (result.rows.length > 0) {
      let updateFields = [];
      for (const [key, value] of Object.entries(result.rows[0])) {
        if (value?.constructor?.name?.toLowerCase() === 'string'
          && !key.toLowerCase().includes('data')
          && value.toLowerCase()?.startsWith('0x')) {
          updateFields.push(key)
        }
      }

      if (updateFields.length > 0) {
        await client.query(`UPDATE ${row.tablename} SET ${updateFields.map((field) => (
          `"${field}"=LOWER("${field}")`
        )).join(',')};`);
      }
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
