import Router from "koa-router";
import * as StatisticCtrl from '../controllers/statistic';

const router = new Router();

export default router;

router.get('/sales',
  StatisticCtrl.retrieveAllSales,
).get('/refunds',
  StatisticCtrl.retrieveAllRefunds,
).get('/purchases',
  StatisticCtrl.retrieveAllPurchases,
);