import http from 'http'
import * as Matrix from 'matrix'
import * as Koa from 'koa'
import KoaSession from 'koa-session'
import KoaGenericSession from 'koa-generic-session'
import * as Request from 'request'
import * as Multer from 'multer'
import * as ajv from 'ajv'
import * as Chakram from 'chakram'
import KER from 'koa-express-router'
import * as mysql from 'mysql'
import * as ws from 'ws'
import * as KoaWs from 'koa-websocket'
import * as CourseServ from '../services/course';

declare const object: Object
declare const paramData: ParamData

const wsApp = !1 && KoaWs()

declare global {
  type Context = Koa.Context
  type WsContext = Koa.WsContext
  type RequestStream = Request.Request
  type ParamData = Matrix.ParamData
  type KoaExpressRouter = KER
  type IMiddleware = (ctx: Context, next: INext) => any
  type Application = Koa
  type MulterInstance = Matrix.MulterInstance
  type MulterOptions = Multer.Options
  type MulterFile = Express.Multer.File
  type Ajv = Matrix.Ajv
  type ValidateFunction = ajv.ValidateFunction
  type JSObject = typeof object & { [x: string]: any }
  type RequestOptions = Request.Options
  type CourseOrExam = Koa.CourseOrExam
  type SubModel = typeof paramData.ce.subModel
  type MysqlConn = mysql.PoolConnection
  type MysqlPool = mysql.Pool
  type MysqlQueryable = MysqlConn | MysqlPool
  type WsApplication = typeof wsApp
  type RawIpGroupSegInfo = Matrix.model.RawIpGroupSegInfo
  type CourseIpInterception = Matrix.model.CourseIpInterception
  type AccessibleCoursesByIp = CourseServ.AccessibleCoursesByIp
  type ProbContent = Matrix.ProbContent
}

declare module 'koa' {
  interface Context {
    paramData: ParamData
    baseUrl: string
    sessionOptions: KoaGenericSession.SessionOptions
  }

  interface WsContext extends Context {
    websocket: ws
    path: string
    req: http.IncomingMessage
    request: any
    res: any
    response: any
  }
}

declare module 'matrix' {
  interface Ajv extends ajv.Ajv {
    _schemas: object
  }
}
