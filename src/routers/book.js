import Router from 'koa-router';
import { exportRtr } from '../utils';
import * as bookCtrl from '../controllers/book';

const router = new Router();

export default router;

router.get('/',
  bookCtrl.retrieveAllBooks,
).put('/',
  bookCtrl.purchaseOneKindOfBook,
).delete('/',
  bookCtrl.refundKindsOfBooks,
);

router.post('/sale',
  bookCtrl.sellBooks,
);