import * as Market from '../models/market';
import { sendData } from '../utils';

export async function retrieveAllMarkets(ctx, next) {
  const data = {};
  const { name } = ctx.query;
  if(!name) {
    data.market = await Market.findAllMarkets();
  } else {
    data.market = await Market.findMarketsByBookname(name);
  }
  return sendData(ctx, data);
}