import Router from 'koa-router';
import * as MarketCtrl from "../controllers/market";

const marketRtr = new Router();

export default marketRtr;

marketRtr.get('/',
  MarketCtrl.retrieveAllMarkets,
);