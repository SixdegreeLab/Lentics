// Build db table and import data,

import { Command } from 'commander';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
const program = new Command();
const { Pool, types } = pg;

// set pg type for query
types.setTypeParser(20, Number);
const parseBigIntArray = types.getTypeParser(1016);
types.setTypeParser(1016, a => parseBigIntArray(a).map(BigInt));

function parseArgs(){
  console.log('process.argv', process.argv)
  program
    .option('-h, --host <char>', 'db host', 'db')
    .option('-p, --port <number>', 'db port', 5432)
    .option('-u, --user <char>', 'db user', 'postgres')
    .option('-w, --password <char>', 'db password', 'postgres')
    .option('-d, --dbname <char>', 'db name', 'lenticsdb')
    .option('-s, --schema <char>', 'the schema file path', 'db/migrate/schema.sql')
    .parse(process.argv);
  return program.opts()
}

async function main() {
  let {
    host,
    port,
    user,
    password,
    dbname,
    schema
  } =  parseArgs();
  const postgresPool = new Pool({
    host: host,
    port: port,
    user: user,
    password: password,
    database: 'postgres'
  });

  const dbPool = new Pool({
    host: host,
    port: port,
    user: user,
    password: password,
    database: dbname
  });

  let postgresClient = await postgresPool.connect();
  let dbExist = await postgresClient.query(`SELECT datname FROM pg_database where "datname" = '${dbname}';`);
  if (!dbExist.rowCount) {
    await postgresClient.query(`CREATE DATABASE ${dbname} WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';`);
  } else {
    console.log(`Database ${dbname} already exists`)
  }
  postgresClient.end();

  console.log("Starting to build schema");

  let client = await dbPool.connect();
  let checkTableExist = await client.query(`SELECT tablename FROM "pg_tables"
    WHERE "tablename" NOT LIKE 'pg%'
    AND "tablename" NOT LIKE 'sql_%'`);

  console.log('Schema path: ', schema);
  if (!checkTableExist.rowCount) {
    const sql = fs.readFileSync(schema);
    await client.query(sql.toString());
  } else {
    console.log('Table already exists, skip building schema');
  }

  console.log("Starting to import seeds");
  let seedsPath = 'db/seeds';
  let fileList = Array()
  fs.readdirSync(seedsPath).forEach(file => {
    if(file.endsWith('sql')){
      fileList.push(path.join(seedsPath, file))
    }
  });
  for (const [index, filename] of fileList.entries()) {
    console.log(`${index+1}/${fileList.length}, process ${filename}...`);
    let insertSql = fs.readFileSync(filename);
    await client.query(insertSql.toString());
  }
  dbPool.end();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
