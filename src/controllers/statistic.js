import * as Statistic from '../models/statistic';
import { sendData } from '../utils';

export async function retrieveAllSales(ctx, next) {
  const data = {};
  data.sales = await Statistic.findAllSales();
  return sendData(ctx, data, 'OK', '查询成功');
}

export async function retrieveAllRefunds(ctx, next) {
  const data = {};
  data.refunds = await Statistic.findAllRefunds();
  return sendData(ctx, data, 'OK', '查询成功');
}

export async function retrieveAllPurchases(ctx, next) {
  const data = {};
  data.purchases = await Statistic.findAllPurchases();
  return sendData(ctx, data, 'OK', '查询成功');
}