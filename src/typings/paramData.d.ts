import * as Koa from 'koa'
import KoaSession from 'koa-session'
import * as CA from '../models/course_assignment'
import * as EA from '../models/exam_assignment'
import * as CAS from '../models/course_assignment_submission'
import * as EAS from '../models/exam_assignment_submission'

declare module 'matrix' {
  interface Session extends KoaSession.Session {
    sessionID: string
  }
  interface User {
    user_id: number
    username: string
    password: string
    nickname: string
    realname: string
    email: string
    avatar: string
  }
  interface CourseOrExam {
    /**
     * course_id / exam_id
     */
    ce_id?: number
    /**
     * 是否是 exam
     */
    isExam: boolean
    /**
     * 课程名称 / 考试名称
     */
    name?: string
    role: null | 'student' | 'TA' | 'teacher'
    what: '课程' | '考试'
    asgnDesc: '作业' | '考题'
    asgnModel: typeof CA | typeof EA
    subModel: typeof CAS | typeof EAS
  }

  interface ProbContent {
    title: string
    description: string
    config: any
    files?: { [type: string]: { [filename: string]: string } }
  }

  interface ParamData {
    [x: string]: any
    body?: { [x: string]: any }
    query?: { [x: string]: any }
    session?: Session
    curUser?: User
    extraMsg?: string
    ip?: string
    host?: string

    user?: User
    course?: {
      course_id: number
      name: string
      unaccessible_reason?: string
      ip_binding?: string
      discussion: {
        id: number
        title: string, description: string
        date: string
        receivers?: any[]
      }
    }
    ce?: CourseOrExam
    asgn?: {
      asgn_id: number, prob_id: number, ptype_id: number
      grade_at_end: number
      plcheck: number, submit_limitation: number
    }
    submission?: { sub_id: number }
    exam?: { exam_id: number, name: string, course_id: number }
    library?: {
      lib_id: number, name: string
      role: null | 'guest' | 'developer' | 'master'
    }
    problem?: ProbContent & {
      prob_id: number
      ptype_id: number
      creator: number
      report: any
    }
    file?: Express.Multer.File
    files?: Express.Multer.File[]
    element?: { pelem_id: number }

    ce_id?: number[]
    asgn_id?: number[]
    delayed_asgn_id_to_notify?: number[]
    accessibleCourses?: AccessibleCoursesByIp
  }
}
