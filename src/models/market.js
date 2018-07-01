import { queryDb } from "../utils/db";

export function findAllMarkets() {
  const sql = `
  SELECT
    market.*, distributor.*, books.bookname
  FROM
    market, books, distributor
  WHERE
    market.bid = books.bid AND market.distributor_id = distributor.distributor_id
  ;`;
  const values = [];
  return queryDb(sql, values);
}

export function findOneMarketById(market_id) {
  const sql = `
  SELECT
    *
  FROM
    market
  WHERE
    market.market_id = ?
  ;`;
  const values = [market_id];
  return queryDb(sql, values);
}

export function findMarketsByBookname(bookname) {
  const sql = `
  SELECT
    market.*, distributor.*, books.bookname
  FROM
    market, books, distributor
  WHERE
    market.bid = books.bid AND market.distributor_id = distributor.distributor_id AND books.bookname = ?
  ;`;
  const values = [bookname];
  return queryDb(sql, values);
}