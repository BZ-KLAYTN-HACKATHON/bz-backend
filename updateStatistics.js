const schedule = require('node-schedule');
const statisticService = require('./api/services/statistics.service.js');
const transactionService = require('./api/services/pe-hero-transaction.service.js');
const orbTransactionService = require('./api/services/orb-transaction.service.js');
const holyTransactionService = require('./api/services/holy-transaction.service.js');
const pieceTransactionService = require('./api/services/piece-transaction.service.js');
const { getProvider } = require('./libs/getProvider.js');
const BigNumber = require('bignumber.js');
const take = require('lodash/take')
const sumBy = require('lodash/sumBy')
const first = require('lodash/first')
const last = require('lodash/last')
const mongoose = require('./mongoose');
mongoose.connect()

const config = require('./config');

console.log('RPC', config.rpc);

const Web3 = require('web3');

// Subscribe HeroMarket's events on-chain
const web3 = new Web3(getProvider(config.rpc));

const job = schedule.scheduleJob('*/15 * * * *', async function () { // Every 5 minutes
  await updateStatistic();
  await updateOrbStatistic();
  await updateHolyStatistic();
  await updatePieceStatistic();
});
const NUMBER_OF_BLOCKS_PER_DAY = 28800;

const updateStatistic = async function () {
  const latestBlockNumber = await web3.eth.getBlockNumber();
  const periods = [...Array(30)].map((e,index) => {
     return {toBlock: latestBlockNumber - index*NUMBER_OF_BLOCKS_PER_DAY,
       fromBlock: latestBlockNumber - (index + 1) * NUMBER_OF_BLOCKS_PER_DAY + 1}
  });
  for (const period of periods) {
    const filledOrders = await transactionService.getFilledOrder(period.fromBlock, period.toBlock);
    const heroesSold = filledOrders.length;
    const totalSale = heroesSold;
    const totalVolume = sumBigNumberString(filledOrders.map(order => order.price));
    period.heroesSold = heroesSold;
    period.totalSale = totalSale;
    period.totalVolume = totalVolume;
  }

  // Calculate one day
  const ONE_DAYS = 'ONE_DAYS';
  const lastOneDays = first(periods)
  await statisticService.updateStatisticByType(
    ONE_DAYS,
    { ...lastOneDays, totalVolume: lastOneDays.totalVolume.toFixed() }
  );

  // Calculate seven day
  const SEVEN_DAYS = 'SEVEN_DAYS';
  const lastSevenDaysData = take(periods,7)
  const seventhDay = last(lastSevenDaysData);
  const heroesSoldSevenDays = sumBy(lastSevenDaysData, 'heroesSold');
  const totalSaleSevenDays = sumBy(lastSevenDaysData, 'totalSale');
  const totalVolumeSevenDays = sumBigNumberString(lastSevenDaysData.map(e => e.totalVolume))
  await statisticService.updateStatisticByType(SEVEN_DAYS, {
    fromBlock: seventhDay.fromBlock, toBlock: lastOneDays.toBlock, totalSale: totalSaleSevenDays,
    heroesSold: heroesSoldSevenDays, totalVolume: totalVolumeSevenDays.toFixed()
  });

  // Calculate ten day
  const TEN_DAYS = 'TEN_DAYS';
  const lastTenDaysData = take(periods,10)
  const tenthDay = last(lastTenDaysData);
  const heroesSoldTenDays = sumBy(lastTenDaysData, 'heroesSold');
  const totalSaleTenDays = sumBy(lastTenDaysData, 'totalSale');
  const totalVolumeTenDays = sumBigNumberString(lastTenDaysData.map(e => e.totalVolume))
  await statisticService.updateStatisticByType(TEN_DAYS, {fromBlock: tenthDay.fromBlock,
    toBlock: lastOneDays.toBlock, totalSale: totalSaleTenDays,
    heroesSold: heroesSoldTenDays, totalVolume: totalVolumeTenDays.toFixed()});

  // Calculate ten day
  const THIRTY_DAYS = 'THIRTY_DAYS';
  const lastThirtyDaysData = take(periods,30)
  const thirtiethDay = last(lastThirtyDaysData);
  const heroesSoldThirtyDays = sumBy(lastThirtyDaysData, 'heroesSold');
  const totalSaleThirtyDays = sumBy(lastThirtyDaysData, 'totalSale');
  const totalVolumeThirtyDays = sumBigNumberString(lastThirtyDaysData.map(e => e.totalVolume))
  await statisticService.updateStatisticByType(THIRTY_DAYS, {fromBlock: thirtiethDay.fromBlock,
    toBlock: lastOneDays.toBlock, totalSale: totalSaleThirtyDays,
    heroesSold: heroesSoldThirtyDays, totalVolume: totalVolumeThirtyDays.toFixed()});
/*
  const statistic = await statisticController.getStatisticByType(ONE_DAYS);
*/
};

const updateOrbStatistic = async function () {
  const latestBlockNumber = await web3.eth.getBlockNumber();
  const periods = [...Array(30)].map((e,index) => {
    return {toBlock: latestBlockNumber - index*NUMBER_OF_BLOCKS_PER_DAY,
      fromBlock: latestBlockNumber - (index + 1) * NUMBER_OF_BLOCKS_PER_DAY + 1}
  });
  for (const period of periods) {
    const filledOrders = await orbTransactionService.getFilledOrder(period.fromBlock, period.toBlock);
    const orbsSold = filledOrders.length;
    const totalSale = orbsSold;
    const totalVolume = sumBigNumberString(filledOrders.map(order => order.price));
    period.orbsSold = orbsSold;
    period.totalSale = totalSale;
    period.totalVolume = totalVolume;
  }

  // Calculate one day
  const ONE_DAYS = 'ORB_ONE_DAYS';
  const lastOneDays = first(periods)
  await statisticService.updateStatisticByType(
    ONE_DAYS,
    { fromBlock: lastOneDays.fromBlock,
      toBlock: lastOneDays.toBlock, info: { totalVolume: lastOneDays.totalVolume.toFixed(), totalSale: lastOneDays.totalSale, orbsSold: lastOneDays.orbsSold.toFixed() } }
  );

  // Calculate seven day
  const SEVEN_DAYS = 'ORB_SEVEN_DAYS';
  const lastSevenDaysData = take(periods,7)
  const seventhDay = last(lastSevenDaysData);
  const orbsSoldSevenDays = sumBy(lastSevenDaysData, 'orbsSold');
  const totalSaleSevenDays = sumBy(lastSevenDaysData, 'totalSale');
  const totalVolumeSevenDays = sumBigNumberString(lastSevenDaysData.map(e => e.totalVolume))
  await statisticService.updateStatisticByType(SEVEN_DAYS, {
    fromBlock: seventhDay.fromBlock,
    toBlock: lastOneDays.toBlock,
    info: {
      totalSale: totalSaleSevenDays,
      orbsSold: orbsSoldSevenDays, totalVolume: totalVolumeSevenDays.toFixed()
    }
  });

  // Calculate ten day
  const TEN_DAYS = 'ORB_TEN_DAYS';
  const lastTenDaysData = take(periods,10)
  const tenthDay = last(lastTenDaysData);
  const orbsSoldTenDays = sumBy(lastTenDaysData, 'orbsSold');
  const totalSaleTenDays = sumBy(lastTenDaysData, 'totalSale');
  const totalVolumeTenDays = sumBigNumberString(lastTenDaysData.map(e => e.totalVolume))
  await statisticService.updateStatisticByType(TEN_DAYS, {
    fromBlock: tenthDay.fromBlock,
    toBlock: lastOneDays.toBlock,
    info: {
      totalSale: totalSaleTenDays,
      orbsSold: orbsSoldTenDays, totalVolume: totalVolumeTenDays.toFixed()
    }});

  // Calculate ten day
  const THIRTY_DAYS = 'ORB_THIRTY_DAYS';
  const lastThirtyDaysData = take(periods,30)
  const thirtiethDay = last(lastThirtyDaysData);
  const orbsSoldThirtyDays = sumBy(lastThirtyDaysData, 'orbsSold');
  const totalSaleThirtyDays = sumBy(lastThirtyDaysData, 'totalSale');
  const totalVolumeThirtyDays = sumBigNumberString(lastThirtyDaysData.map(e => e.totalVolume))
  await statisticService.updateStatisticByType(THIRTY_DAYS, {
    fromBlock: thirtiethDay.fromBlock,
    toBlock: lastOneDays.toBlock,
    info: {
      totalSale: totalSaleThirtyDays,
      orbsSold: orbsSoldThirtyDays, totalVolume: totalVolumeThirtyDays.toFixed()
    }
  });
};

const updateHolyStatistic = async function () {
  const latestBlockNumber = await web3.eth.getBlockNumber();
  const periods = [...Array(30)].map((e,index) => {
    return {toBlock: latestBlockNumber - index*NUMBER_OF_BLOCKS_PER_DAY,
      fromBlock: latestBlockNumber - (index + 1) * NUMBER_OF_BLOCKS_PER_DAY + 1}
  });
  for (const period of periods) {
    const filledOrders = await holyTransactionService.getFilledOrder(period.fromBlock, period.toBlock);
    const holiesSold = filledOrders.length;
    const totalSale = holiesSold;
    const totalVolume = sumBigNumberString(filledOrders.map(order => order.price));
    period.holiesSold = holiesSold;
    period.totalSale = totalSale;
    period.totalVolume = totalVolume;
  }

  // Calculate one day
  const ONE_DAYS = 'HOLY_ONE_DAYS';
  const lastOneDays = first(periods)
  await statisticService.updateStatisticByType(
    ONE_DAYS,
    { fromBlock: lastOneDays.fromBlock,
      toBlock: lastOneDays.toBlock, info: { totalVolume: lastOneDays.totalVolume.toFixed(), totalSale: lastOneDays.totalSale, holiesSold: lastOneDays.holiesSold.toFixed() } }
  );

  // Calculate seven day
  const SEVEN_DAYS = 'HOLY_SEVEN_DAYS';
  const lastSevenDaysData = take(periods,7)
  const seventhDay = last(lastSevenDaysData);
  const holiesSoldSevenDays = sumBy(lastSevenDaysData, 'holiesSold');
  const totalSaleSevenDays = sumBy(lastSevenDaysData, 'totalSale');
  const totalVolumeSevenDays = sumBigNumberString(lastSevenDaysData.map(e => e.totalVolume))
  await statisticService.updateStatisticByType(SEVEN_DAYS, {
    fromBlock: seventhDay.fromBlock,
    toBlock: lastOneDays.toBlock,
    info: {
      totalSale: totalSaleSevenDays,
      holiesSold: holiesSoldSevenDays, totalVolume: totalVolumeSevenDays.toFixed()
    }
  });

  // Calculate ten day
  const TEN_DAYS = 'HOLY_TEN_DAYS';
  const lastTenDaysData = take(periods,10)
  const tenthDay = last(lastTenDaysData);
  const holiesSoldTenDays = sumBy(lastTenDaysData, 'holiesSold');
  const totalSaleTenDays = sumBy(lastTenDaysData, 'totalSale');
  const totalVolumeTenDays = sumBigNumberString(lastTenDaysData.map(e => e.totalVolume))
  await statisticService.updateStatisticByType(TEN_DAYS, {
    fromBlock: tenthDay.fromBlock,
    toBlock: lastOneDays.toBlock,
    info: {
      totalSale: totalSaleTenDays,
      holiesSold: holiesSoldTenDays, totalVolume: totalVolumeTenDays.toFixed()
    }});

  // Calculate ten day
  const THIRTY_DAYS = 'HOLY_THIRTY_DAYS';
  const lastThirtyDaysData = take(periods,30)
  const thirtiethDay = last(lastThirtyDaysData);
  const holiesSoldThirtyDays = sumBy(lastThirtyDaysData, 'holiesSold');
  const totalSaleThirtyDays = sumBy(lastThirtyDaysData, 'totalSale');
  const totalVolumeThirtyDays = sumBigNumberString(lastThirtyDaysData.map(e => e.totalVolume))
  await statisticService.updateStatisticByType(THIRTY_DAYS, {
    fromBlock: thirtiethDay.fromBlock,
    toBlock: lastOneDays.toBlock,
    info: {
      totalSale: totalSaleThirtyDays,
      holiesSold: holiesSoldThirtyDays, totalVolume: totalVolumeThirtyDays.toFixed()
    }
  });
};

const updatePieceStatistic = async function () {
  const latestBlockNumber = await web3.eth.getBlockNumber();
  const periods = [...Array(30)].map((e,index) => {
    return {toBlock: latestBlockNumber - index*NUMBER_OF_BLOCKS_PER_DAY,
      fromBlock: latestBlockNumber - (index + 1) * NUMBER_OF_BLOCKS_PER_DAY + 1}
  });
  for (const period of periods) {
    const filledOrders = await pieceTransactionService.getFilledOrder(period.fromBlock, period.toBlock);
    const piecesSold = filledOrders.length;
    const totalSale = piecesSold;
    const totalVolume = sumBigNumberString(filledOrders.map(order => order.price));
    period.piecesSold = piecesSold;
    period.totalSale = totalSale;
    period.totalVolume = totalVolume;
  }

  // Calculate one day
  const ONE_DAYS = 'PIECE_ONE_DAYS';
  const lastOneDays = first(periods)
  await statisticService.updateStatisticByType(
    ONE_DAYS,
    { fromBlock: lastOneDays.fromBlock,
      toBlock: lastOneDays.toBlock, info: { totalVolume: lastOneDays.totalVolume.toFixed(), totalSale: lastOneDays.totalSale, piecesSold: lastOneDays.piecesSold.toFixed() } }
  );

  // Calculate seven day
  const SEVEN_DAYS = 'PIECE_SEVEN_DAYS';
  const lastSevenDaysData = take(periods,7)
  const seventhDay = last(lastSevenDaysData);
  const piecesSoldSevenDays = sumBy(lastSevenDaysData, 'piecesSold');
  const totalSaleSevenDays = sumBy(lastSevenDaysData, 'totalSale');
  const totalVolumeSevenDays = sumBigNumberString(lastSevenDaysData.map(e => e.totalVolume))
  await statisticService.updateStatisticByType(SEVEN_DAYS, {
    fromBlock: seventhDay.fromBlock,
    toBlock: lastOneDays.toBlock,
    info: {
      totalSale: totalSaleSevenDays,
      piecesSold: piecesSoldSevenDays, totalVolume: totalVolumeSevenDays.toFixed()
    }
  });

  // Calculate ten day
  const TEN_DAYS = 'PIECE_TEN_DAYS';
  const lastTenDaysData = take(periods,10)
  const tenthDay = last(lastTenDaysData);
  const piecesSoldTenDays = sumBy(lastTenDaysData, 'piecesSold');
  const totalSaleTenDays = sumBy(lastTenDaysData, 'totalSale');
  const totalVolumeTenDays = sumBigNumberString(lastTenDaysData.map(e => e.totalVolume))
  await statisticService.updateStatisticByType(TEN_DAYS, {
    fromBlock: tenthDay.fromBlock,
    toBlock: lastOneDays.toBlock,
    info: {
      totalSale: totalSaleTenDays,
      piecesSold: piecesSoldTenDays, totalVolume: totalVolumeTenDays.toFixed()
    }});

  // Calculate ten day
  const THIRTY_DAYS = 'PIECE_THIRTY_DAYS';
  const lastThirtyDaysData = take(periods,30)
  const thirtiethDay = last(lastThirtyDaysData);
  const piecesSoldThirtyDays = sumBy(lastThirtyDaysData, 'piecesSold');
  const totalSaleThirtyDays = sumBy(lastThirtyDaysData, 'totalSale');
  const totalVolumeThirtyDays = sumBigNumberString(lastThirtyDaysData.map(e => e.totalVolume))
  await statisticService.updateStatisticByType(THIRTY_DAYS, {
    fromBlock: thirtiethDay.fromBlock,
    toBlock: lastOneDays.toBlock,
    info: {
      totalSale: totalSaleThirtyDays,
      piecesSold: piecesSoldThirtyDays, totalVolume: totalVolumeThirtyDays.toFixed()
    }
  });
};

function sumBigNumberString(bigNumberStrings) {
  // Return BigNumber
  let sum = new BigNumber('0');
  for (const number of bigNumberStrings) {
    if (number) {
      sum = sum.plus(new BigNumber(number));
    }
  }
  return sum;
}
