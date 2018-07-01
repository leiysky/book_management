/**
 * 导出路由
 * @param   {KoaExpressRouter}   router
 */
export function exportRtr(router) {
  return router.routes();
}

/**
 * 无抛出 err 时统一使用这个函数来发送响应
 * 说明： 即使出现比如密码错误这种错误也应该使用这个函数
 *       而不是用 handleError，因为没有抛出异常
 * @param  {Context}  ctx
 * @param  {Object}   data
 * @param  {string}   [status]
 * @param  {string}   [msg]
 * @param  {number}   [code]
 */
export async function sendData(ctx, data, status = 'OK', msg = 'OK', code = 200) {
  data = data || {};
  ctx.status = code;
  const time = new Date();
  ctx.body = { status, msg, data, time };
}