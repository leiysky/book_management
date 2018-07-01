import { sendData } from '../utils';
import * as Book from '../models/book';
import * as Market from '../models/market';
import { transaction } from "../utils/db";

/**
 * @description 返回所有书的库存
 * @param {Context} ctx 
 * @param {next} next 
 */
export async function retrieveAllBooks(ctx, next) {
  const data = {};
  data.books = await Book.findAllBooksFromRepo();
  return sendData(ctx, data);
}

/**
 * @returns {}
 * @param {Context} ctx 
 * @param {next} next 
 */
export async function purchaseOneKindOfBook(ctx, next) {
  const { market_id, quantity } = ctx.paramData.body;
  const [ market = {} ] = await Market.findOneMarketById(market_id);
  await transaction(async (conn) => {
    await Book.insertOnePurchase(market.bid, quantity, market.price, conn);
    await Book.updateOneBookStocksById(market.bid, quantity, conn);
  });
  return sendData(ctx, {}, 'OK', '进货成功');
}

/**
 * @description 按退货列表退货
 * @param {Context} ctx 
 * @param {next} next 
 */
export async function refundKindsOfBooks(ctx, next) {
  const { refunds } = ctx.paramData.body;
  await transaction(async (conn) => {
    refunds.forEach(oneRefund => {
      Book.updateOneBookStocksById(oneRefund.bid, oneRefund.quantity, conn);
    });
    await Book.insertOneRefund(JSON.stringify(refunds), conn);
  });
  return sendData(ctx, {}, 'OK', '退货成功');
}


/**
 * @description 销售图书
 * @param {Context} ctx 
 * @param {next} next 
 */
export async function sellBooks(ctx, next) {
  const { sales } = ctx.paramData.body;
  let status = 'OK';
  let msg = '销售成功';
  await transaction(async (conn) => {
    for (let i in sales) {
      const count = await Book.getStocksOfOneBookById(sales[i].bid, conn);
      if ( count[0].stocks < sales[i].quantity) {
        status = 'BAD_REQUEST';
        msg = '库存不足';
        return;
      } else {
        Book.updateOneBookStocksById(sales[i].bid, -sales[i].quantity, conn);
        Book.updateOneBookSalesById(sales[i].bid, sales[i].quantity, conn);
      }
    }
    await Book.insertOneSale(JSON.stringify(sales), conn);
  });
  return sendData(ctx, {}, status, msg);
}