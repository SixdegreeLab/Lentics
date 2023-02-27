import { Command } from 'commander';
import pg from 'pg';
const program = new Command();
const { Pool, types } = pg;
import axios from 'axios';

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
  const tokens = ['usd-coin','wmatic','dai','weth','toucan-protocol-nature-carbon-tonne']

  let client = await dbPool.connect();
  let curDate, historyDate, history, pgDate;

  for(let coin_id of tokens.values()) {
    // get max date from price table, default from 2022-05-01 to Now
    const dateQuery = await client.query(`SELECT max(minute) as minute FROM price_usd WHERE coin_id='${coin_id}';`);
    const maxDate = dateQuery.rows[0].minute ? dateQuery.rows[0].minute : new Date('2022-05-01');
    const loop = Math.ceil(Math.abs(new Date().getTime() - maxDate.getTime()) / 86400000);
    for (let i=0; i<loop; i++) {
      curDate = addDate(maxDate, i);
      historyDate = `${fixDate(curDate.getDate())}-${fixDate(curDate.getMonth()+1)}-${curDate.getFullYear()}`;
      pgDate = `${curDate.getFullYear()}-${fixDate(curDate.getMonth()+1)}-${fixDate(curDate.getDate())}`;
      // get token history
      history = await getCoin(coin_id, historyDate);
      console.log(history?.market_data?.current_price?.usd, coin_id, historyDate, pgDate);
      // save price db
      if(history && history?.market_data?.current_price?.usd) {
        await client.query(`
          insert into price_usd (
            id,
            coin_id,
            price,
            minute
          ) values (
            nextval('price_usd_id_seq'),
            '${coin_id}',
            ${history.market_data.current_price.usd},
            '${pgDate}'
          ) on conflict(coin_id,minute) do
          update set
            price = ${history.market_data.current_price.usd}
        `);
      } else {
        console.log('API limitation/error, try again in a minute!');
        return;
      }
      await sleep();
    }
  }

  // for (let i=0; i<loop; i++) {
  //   curDate = addDate(maxDate, i);
  //   historyDate = `${fixDate(curDate.getDate())}-${fixDate(curDate.getMonth()+1)}-${curDate.getFullYear()}`;
  //   pgDate = `${curDate.getFullYear()}-${fixDate(curDate.getMonth()+1)}-${fixDate(curDate.getDate())}`;
  //   for(let coin_id of tokens.values()) {
  //     // get token history
  //     history = await getCoin(coin_id, historyDate);
  //     console.log(history?.market_data?.current_price?.usd, coin_id, historyDate, pgDate);
  //     // save price db
  //     if(history && history?.market_data?.current_price?.usd) {
  //       await client.query(`
  //         insert into price_usd (
  //           id,
  //           coin_id,
  //           price,
  //           minute
  //         ) values (
  //           nextval('price_usd_id_seq'),
  //           '${coin_id}',
  //           ${history.market_data.current_price.usd},
  //           '${pgDate}'
  //         ) on conflict(coin_id,minute) do
  //         update set
  //           price = ${history.market_data.current_price.usd}
  //       `);
  //     }
  //     await sleep();
  //   }
  // }

  dbPool.end();
}

// id: usd-coin/wmatic/dai/weth/toucan-protocol-nature-carbon-tonne
// date: dd-mm-yyyy eg. 17-01-2023
async function getCoin(id, date) {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}/history?date=${date}&localization=false`,
      // 'http://192.168.31.69:3003/coin/history',
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept-Encoding": "*",
          "Accept": "application/json",
        },
        // proxy: {
        //   protocol: 'http',
        //   host: '192.168.31.2',
        //   port: 8118
        // },
      }
    );
    return response.data;
  } catch (error) {
    // console.log(error);
    return null;
  }
}

// defautl rendom(4s-9s) to sleep
function sleep(time) {
  let mTime = time || parseInt(Math.random() * 5000 + 4000);
  return new Promise((resolve) => setTimeout(resolve, mTime));
}

function fixDate(m) {
  return (m < 10) ? `0${m}` : `${m}`;
}

function addDate(date, days) {
  let d = new Date(date);
  return new Date(d.setDate(d.getDate() + days));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });