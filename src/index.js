import Koa from 'koa';
import { logRequest } from './utils/logger';
import route from './routers';


const app = new Koa();
const port = 3003;


app.use(logRequest);
route(app);

app.listen(port, () => {
  console.log(`服务端启动，监听端口${port}`);
});

