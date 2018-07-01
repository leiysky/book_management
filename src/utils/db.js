import mysql from 'mysql';
import ConnectionClass from 'mysql/lib/Connection';
import PoolClass from 'mysql/lib/Pool';
import util from 'util';
import * as ME from './ME';
import { has } from 'lodash';

// import { db } from '../../config';

const db = {
  host: '127.0.0.1',
  user: 'root',
  password: 'ly19981024',
  database: 'book_management',
  port: 3306,
};

function promisifyAll(obj, suffix = 'Async') {
  for (const [key, value] of Object.entries(obj)) {
    const promisifiedKey = key + suffix;
    const isNotSimpleFunc = (Object.prototype.toString.call(value) !== '[object Function]');
    const hasPromisifiedKey = has(obj, promisifiedKey);
    if (isNotSimpleFunc || hasPromisifiedKey) continue;
    obj[promisifiedKey] = util.promisify(value);
  }
  return obj;
}

promisifyAll(ConnectionClass.prototype);
promisifyAll(PoolClass.prototype);

const Pool = mysql.createPool({...db, connectionLimit: 5});
const PoolForSelect = mysql.createPool({...db, connectionLimit: 5});
// 由于用了私有变量 不能保证这些私有变量的存在不随版本更新而变化 所以力所能及
// guard 一下
// @ts-ignore
const canCheckPool =
    Pool._freeConnections && Pool._allConnections && Pool.config;

Pool.on('connection', (conn) => {
  conn.query('SET SESSION wait_timeout = 600;');  // 10 min
});
PoolForSelect.on('connection', (conn) => {
  conn.query('SET SESSION wait_timeout = 60;');  // 1 min
});

async function getConn() {
  try {
    return await Pool.getConnectionAsync();
  } catch (e) {
    throw new ME.HardError(ME.INTERNAL_ERROR, '数据库连接出错', 500, e);
  }
}

/**
 * 查询数据库
 * @param  {string}              sql      数据库查询语句
 * @param  {any[]}               values   参数值
 * @param  {MysqlQueryable}      [conn]   数据库连接。传入时使用该连接，不传入的话直接用Pool
 */
export async function queryDb(sql, values, conn) {
  // 若传入连接则使用该连接，否则默认使用连接池
  if (!conn) {
    if (canCheckPool &&
        // Pool 满了
        // @ts-ignore
        Pool._freeConnections.length === 0 &&
        // @ts-ignore
        Pool._allConnections.length === Pool.config.connectionLimit &&
        // 是 SELECT 操作
        sql.trim().slice(0, 6).toUpperCase() === 'SELECT') {
      conn = PoolForSelect;
    } else {
      conn = Pool;
    }
  }
  try {
    return await conn.queryAsync(sql, values);
  } catch (e) {
    e.stack += `\n---------\n${e.sqlMessage}:\n${e.sql}\n---------`;
    throw new ME.HardError(ME.INTERNAL_ERROR, '数据库查询出错', 500, e);
  }
}

/**
 * 为传入的函数封装事务
 *
 * 传入的 func 原型为 (conn): any，抛出异常则被回滚
 *
 * @param  {{(conn: MysqlConn): any}}   func        参数为数据库连接 conn
 * @author 陈宇翔
 */
export async function transaction(func) {
  /** @type {MysqlConn} */
  let conn = null;
  let isFuncError = false;
  try {
    conn = await getConn();              // 获取连接
    await conn.beginTransactionAsync();  // 开始事务

    try {
      await func(conn);
    } catch (e) {
      isFuncError = true;
      throw e;
    }

    await conn.commitAsync();  // 提交事务
  } catch (e) {
    if (conn) {
      try {
        await conn.rollbackAsync();  // 回滚事务
      } finally {
        // pass
      }
    }

    // 继续抛 func 抛出的异常
    if (isFuncError) {
      throw e;
    }

    throw new ME.HardError(ME.INTERNAL_ERROR, '数据库事务出错', 500, e);
  } finally {
    if (conn) conn.release();  // 释放连接
  }
}
