declare module 'matrix' {
  declare namespace model {
    interface RawIpGroupSegInfo {
      ip_group_id: number
      description: string
      prefix: string
      mask: string
    }

    interface CourseIpInterception {
      course_id: number
      course_name: string
      description: string
      prefix: string
      mask: string
      role: 'teacher' | 'TA' | 'student' | 'none'
      status: 'open' | 'close'
    }
  }
}