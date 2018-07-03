import { queryDb } from "../utils/db";

/**
 * @description 查找所有销售记录
 */
export function findAllSales() {
  const sql = `
  SELECT
    sale_table.*, books.bookname, books.price
  FROM
  (SELECT
    sale_items->'$[0].bid' AS bid, sale.sale_id AS sale_id, sale.sale_date AS sale_date, sale_items->'$[0].quantity' AS quantity
  FROM
    sale) AS sale_table
  LEFT JOIN
    books
  ON
    sale_table.bid = books.bid
  ;`;
  const values = [];
  return queryDb(sql, values);
}

export function findAllRefunds() {
  const sql = `
  SELECT
    refund_table.*, books.bookname, books.price
  FROM
  (SELECT
    refund_items->'$[0].bid' AS bid, refund.refund_id, refund_date, refund_items->'$[0].quantity' AS quantity
  FROM
    refund) AS refund_table
  LEFT JOIN
    books
  ON
    refund_table.bid = books.bid
  ;`;
  const values = [];
  return queryDb(sql, values);
}

export function findAllPurchases() {
  const sql = `
  SELECT
    purchase.*, books.bookname
  FROM
    purchase
  LEFT JOIN
    books
  ON
    purchase.bid = books.bid
  ;`;
  const values = [];
  return queryDb(sql, values);
}