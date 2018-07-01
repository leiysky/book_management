import moment from 'moment';

const logger = console;
export default logger;
/**
 *
 * @param {Context}             ctx
 * @param {{(): Promise<any>}}  next
 */
export async function logRequest(ctx, next) {
  const start = process.hrtime();
  await next();
  const elapsed = process.hrtime(start);
  const interval = `${(elapsed[0] * 1000 + elapsed[1] / 1e6).toFixed(3)} ms`;

  const {
    body: { msg = '', status = '' } = {},
    paramData: { curUser = null, extraMsg = '' } = {},
    session = {},
    status: statusNum,
    method,
    originalUrl,
  } = ctx;

  const user = curUser || session.user || {};
  const timeText = (now()) || '';
  const userIdText = String(user.user_id || '00000').padEnd(5, ' ');
  const usernameText = String(user.username || '00000000').padEnd(8, ' ');
  const realnameText = String(user.realname || '未登录').padEnd(3, ' ');
  const statusText = (status && ` ${status}`) || '';
  const msgText = (msg && ` - ${msg}`) || '';
  const extraMsgText = (extraMsg && ` - ${extraMsg}`) || '';
  let url = originalUrl;
  try {
    url = decodeURIComponent(originalUrl);
  } catch (e) {
    // pass
  }

  let func = 'info';
  if (statusNum >= 400 && statusNum < 500) {
    func = 'warn';
  } else if (statusNum >= 500) {
    func = 'error';
  }
  logger[func](`${timeText} - ${method} ${url} - ${interval} - ${statusNum}${statusText}${msgText}${extraMsgText}`);
}

function now() {
  return moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS ');
}
