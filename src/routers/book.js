import Router from 'koa-router';
import { exportRtr } from '../utils';
import * as bookCtrl from '../controllers/book';

const router = new Router();

export default router;

router.get('/',
  bookCtrl.retrieveAllBooks,
  bookCtrl.retrieveOneBookByBookname,
).put('/',
  bookCtrl.purchaseOneKindOfBook,
).post('/refund',
  bookCtrl.refundKindsOfBooks,
);

router.post('/sale',
  bookCtrl.sellBooks,
);