import _ from 'lodash';

export const OK = 'OK';
export const BAD_REQUEST = 'BAD_REQUEST';
export const NOT_AUTHORIZED = 'NOT_AUTHORIZED';
export const WRONG_PASSWORD = 'WRONG_PASSWORD';
export const WRONG_CAPTCHA = 'WRONG_CAPTCHA';
export const NO_PERMISSION = 'NO_PERMISSION';
export const NOT_FOUND = 'NOT_FOUND';
export const TOO_FREQUENT = 'TOO_FREQUENT';
export const UNKNOWN_ERROR = 'UNKNOWN_ERROR';
export const INTERNAL_ERROR = 'INTERNAL_ERROR';

const map = {
  OK: 200,
  BAD_REQUEST: 400,
  WRONG_CAPTCHA: 400,
  NOT_AUTHORIZED: 401,
  WRONG_PASSWORD: 401,
  NO_PERMISSION: 403,
  NOT_FOUND: 404,
  TOO_FREQUENT: 429,
  UNKNOWN_ERROR: 500,
  INTERNAL_ERROR: 500,
};

function getCode(status) {
  return map[status] || 400;
}

export class MatrixError extends Error {
  /**
   * 构造 Matrix 异常
   * @param  {string}        status
   * @param  {string}        msg
   * @param  {Error|string}  [e]
   * @param  {number}        [code]
   * @param  {any}           [data]
   */
  constructor(status, msg, code = undefined, e = undefined, data = undefined) {
    const was = _.isObject(e) ? 'error' : typeof e;

    let stack;
    if (e instanceof Error) {
      stack = e.stack.split('\n');
      stack[0] = '--------------------';
      stack = stack.join('\n');
    } else {
      e = e || msg;
    }

    super(String(e));

    // copy properties
    Object.keys(e).forEach((key) => { this[key] = e[key]; });

    /** @type {typeof was} */
    this.was = was;
    /** @type {{ status: string, msg: string, code?: number, data?: any }} */
    this.info = { status, msg };

    if (code !== undefined) Object.assign(this.info, { code });
    if (data !== undefined) Object.assign(this.info, { data });

    // use this.name to populate stack
    this.name = Reflect.getPrototypeOf(this).constructor.name;
    this.stack = `${this.stack}\n${stack}\nInfo: ${JSON.stringify(this.info)}`;
    // and delete this.name after using
    delete this.name;
  }

  /**
   * 若不是实例，则抛出
   * @param {Error} e
   */
  static throwIfNotInstance(e) {
    if (!(e instanceof MatrixError)) throw e;
  }
}

export class SoftError extends MatrixError {
  /**
   * 构造 Matrix 软异常
   * @param  {string}        status
   * @param  {string}        msg
   * @param  {Error|string}  [e]
   * @param  {number}        [code]
   * @param  {any}           [data]
   */
  constructor(status, msg, code = getCode(status), e = undefined, data = undefined) {
    super(status, msg, code, e, data);
  }
  /**
   * 若不是实例，则抛出
   * @param {Error} e
   */
  static throwIfNotInstance(e) {
    if (!(e instanceof SoftError)) throw e;
  }
}

export class HardError extends MatrixError {
  /**
   * 若不是实例，则抛出
   * @param {Error} e
   */
  static throwIfNotInstance(e) {
    if (!(e instanceof HardError)) throw e;
  }
}
