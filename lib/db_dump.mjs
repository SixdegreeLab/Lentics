// Dump db data

import { Command } from 'commander';
import pg from 'pg';
import fs from 'fs';
const program = new Command();
const { Pool, types } = pg;

// set pg type for query
types.setTypeParser(20, Number);
const parseBigIntArray = types.getTypeParser(1016);
types.setTypeParser(1016, a => parseBigIntArray(a).map(Number));

function parseArgs(){
  console.log('process.argv', process.argv)
  program
    .option('-h, --host <char>', 'db host', 'db')
    .option('-p, --port <number>', 'db port', 5432)
    .option('-u, --user <char>', 'db user', 'postgres')
    .option('-w, --password <char>', 'db password', 'postgres')
    .option('-d, --dbname <char>', 'db name', 'postgres')
    .option('-l, --limit <number>', 'max data size of each table', 1000)
    .option('-o, --output <char>', 'the folder for output', 'db/seeds')
    .parse(process.argv);
  return program.opts()
}

function getTableFieldValue(val) {
  let fieldValue;
  switch (val.constructor.name) {
    case 'Array':
      fieldValue = `ARRAY[${val.map((v) => (getTableFieldValue(v))).join(',')}]`;
      break;
    case 'Number':
    case 'Boolean':
      fieldValue = val;
      break;
    default:
      fieldValue = `'${val}'`;
  }

  return fieldValue
}

function saveSql(outputFp, tableName, result) {
  let columnNames = result.fields.map((f) => (f.name));
  let tableCol = '"'+ columnNames.join('" , "')+'" ';
  let tableVal = "";
  for (const [index, element] of result.rows.entries()) {
    tableVal += `(${Object.values(element).map((v) => (getTableFieldValue(v))).join(',')})`;
    if (index + 1 < result.rows.length) {
      tableVal += ', '
    }
  }
  fs.appendFileSync(outputFp, `INSERT INTO ${tableName} (${tableCol}) VALUES ${tableVal} ON CONFLICT DO NOTHING;\n`, function (err) {
    if (err) {
      console.log(err)
    }
  })
}

async function main() {
  let {
    host,
    port,
    user,
    password,
    dbname,
    limit,
    output
  } =  parseArgs();

  const dbPool = new Pool({
    host: host,
    port: port,
    user: user,
    password: password,
    database: dbname
  });

  try {
    let timestamp = Date.now();
    let client = await dbPool.connect();

    console.log("Dumping profile table");
    let profiles = await client.query({
      text: `SELECT * FROM lenshub_event_profilecreated LIMIT ${limit};`,
      types
    });

    let outputFp = `${output}/lenshub_event_profilecreated_dump_${timestamp}.sql`;
    let profileIds = [];
    if (!fs.existsSync(outputFp)) {
      let columnNames = profiles.fields.map((f) => (f.name));
      let tableCol = '"'+ columnNames.join('" , "')+'" ';
      let tableVal = "";
      for (const [index, element] of profiles.rows.entries()) {
        profileIds.push(element.profileId);
        tableVal += `(${Object.values(element).map((v) => (getTableFieldValue(v))).join(',')})`;
        if (index + 1 < profiles.rows.length) {
          tableVal += ', '
        }
      }

      fs.appendFileSync(outputFp, `INSERT INTO lenshub_event_profilecreated (${tableCol}) VALUES ${tableVal} ON CONFLICT DO NOTHING;\n`, function (err) {
        if (err) {
          console.log(err)
        }
      });
    }


    let profileRelatedTables = await client.query(`
    SELECT table_name, column_name FROM information_schema.columns
    WHERE "table_schema" = 'public'
    AND "table_name" != 'lenshub_event_profilecreated'
    AND ("column_name" = 'profileId' or "column_name" = 'profileIds');`)
    console.log("Dumping profile related tables:", profileRelatedTables.rows.map((t) => (t.table_name)));

    let processedTables = [];
    for(let table of profileRelatedTables.rows) {
      processedTables.push(table.table_name);
      outputFp = `${output}/${table.table_name}_dump_${timestamp}.sql`;
      if (!fs.existsSync(outputFp)) {
        let result;
        if (table.column_name === 'profileIds') {
          let sql = '';
          let sliceProfileIds = profileIds;//.slice(0, 10);
          for (const [index, element] of sliceProfileIds.entries()) {
            sql += `SELECT * FROM ${table.table_name} WHERE ${element} = Any("${table.column_name}")`
            if (index + 1 < sliceProfileIds.length) {
              sql += ' UNION '
            }
          }
          result = await client.query({
            text: `${sql} LIMIT ${limit}`,
            types
          });
        } else {
          result = await client.query({
            text: `SELECT * FROM ${table.table_name} WHERE "${table.column_name}" IN (${profileIds.join(',')}) LIMIT ${limit};`,
            types
          });
        }
        saveSql(outputFp, table.table_name, result);
      }
    }

    let otherTables = await client.query(`SELECT tablename FROM "pg_tables"
    WHERE "tablename" NOT LIKE 'pg%'
    AND "tablename" NOT LIKE 'sql_%'
    AND "tablename" NOT IN ('${processedTables.join("', '")}')
    ORDER BY "tablename";`);
    console.log("Dumping other tables:", otherTables.rows.map((t) => (t.tablename)));

    for(let table of otherTables.rows) {
      outputFp = `${output}/${table.tablename}_dump_${timestamp}.sql`;
      if (!fs.existsSync(outputFp)) {
        let result = await client.query({
          text: `SELECT * FROM ${table.tablename} LIMIT ${limit};`,
          types
        });
        saveSql(outputFp, table.tablename, result);
      }
    }
  } catch (e) {
    console.error(e)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
