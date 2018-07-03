import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';

import * as ME from '../utils/ME';

import bookRtr from './book';
import marketRtr from "./market";
import stasticRtr from "./statistic";

/**
 * @param {Application} app
 */
export default function route(app) {
  const router = new Router();

  router.use(
      getBodyParser(),
      initParam,
  );

  // 一级路由
  router.use('/book', bookRtr.routes(), bookRtr.allowedMethods());
  router.use('/market', marketRtr.routes(), marketRtr.allowedMethods());
  router.use('/statistic', stasticRtr.routes(), stasticRtr.allowedMethods());

  // 404 guard
  router.use((ctx) => {
    if (ctx.body) return;
    // throw new ME.SoftError(ME.NOT_FOUND, '啊呀, 迷路了');
  });
  app.use(router.routes()).use(router.allowedMethods());
}

function getBodyParser() {
  const options = {
    jsonLimit: '10mb',
    textLimit: '10mb',
    /**
     *
     * @param {Error} e
     */
    onerror(e) {
      throw new ME.SoftError(ME.BAD_REQUEST, '请求解析失败', 422, e);
    },
  };
  return bodyParser(options);
}

/**
 * 初始化 paramData
 * @param {Context} ctx
 * @param {{(): Promise<any>}} next
 */
async function initParam(ctx, next) {
  // @ts-ignore
  ctx.paramData = {
    body: ctx.request.body,
    query: {...ctx.request.query},
    host: ctx.host,
  };
  return next();
}