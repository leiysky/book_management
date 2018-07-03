import { queryDb } from '../utils/db';
import { exportRtr } from '../utils';


/**
 * @description 返回所有仓库中的书
 * @returns {Promise}
 */
export function findAllBooksFromRepo() {
  const sql = `
  SELECT 
    * 
  FROM
    repository
  LEFT JOIN
    books
  ON 
    repository.bid = books.bid
  ;`;
  const values = [];
  return queryDb(sql, values);
}

/**
 * @description 插入一条进货记录
 * @param {number} bid 进货的bookid
 * @param {number} purchase_quantity 进货量
 * @param {number} purchase_price 进货价
 * @param {any} conn mysql连接
 */
export function insertOnePurchase(bid, purchase_quantity, purchase_price, conn) {
  const sql = `
  INSERT INTO
    purchase (bid, purchase_quantity, purchase_price)
  VALUES (?, ?, ?)
  ;`;
  const values = [bid, purchase_quantity, purchase_price];
  return queryDb(sql, values, conn);
}

/**
 * @description 更新一条库存的存量
 * @param {number} bid 更新的存书的bid
 * @param {number} quantity 增加的库存量
 * @param {*} conn 
 */
export function updateOneBookStocksById(bid, quantity, conn) {
  const sql = `
  UPDATE
    repository
  SET
    stocks = stocks + ?
  WHERE
    repository.bid = ?
  ;`;

  const values = [quantity, bid];
  return queryDb(sql, values, conn);
}

/**
 * @description 更新一条库存的销量
 * @param {number} bid 更新的存书的bid
 * @param {number} quantity 销量
 * @param {*} conn 
 */
export function updateOneBookSalesById(bid, quantity, conn) {
  const sql = `
  UPDATE
    repository
  SET
    sales = sales + ?
  WHERE
    repository.bid = ?
  ;`;

  const values = [quantity, bid];
  return queryDb(sql, values, conn);
}

/**
 * @description 插入一条退货单
 * @param {string} refund 退货单的json字符串
 * @param {*} conn 
 */
export function insertOneRefund(refund, conn) {
  const sql = `
  INSERT INTO
    refund (refund_items)
  VALUES (?)
  ;`;
  const values = [refund];
  return queryDb(sql, values, conn);
}

/**
 * @description 查找一本书的库存量
 * @param {number} bid 
 * @param {*} conn 
 */
export function getStocksOfOneBookById(bid, conn) {
  const sql = `
  SELECT 
    stocks
  FROM
    repository
  WHERE
    repository.bid = ?
  ;`;

  const values = [bid];
  return queryDb(sql, values);
}

/**
 * 插入一条销售信息
 * @param {string} sale 
 * @param {*} conn 
 */
export function insertOneSale(sale, conn) {
  const sql = `
  INSERT INTO
    sale (sale_items)
  VALUES (?)
  ;`;

  const values = [sale];
  return queryDb(sql, values, conn);
}

export function findOneBookByBookname(name) {
  const sql = `
  SELECT
    *
  FROM
    repository
  LEFT JOIN
    books
  ON 
    repository.bid = books.bid
  ;`;

  const values = [name];
  return queryDb(sql, values);
}