import path from '../src/assets/js/path'

export default [
  {
    url: path.emailTrace.record,
    type: 'post',
    response: (config) => {
      const { page, limit } = config.body
      const { data, total } = require('./json/analyseRecord')
      return {
        data: data.slice((page - 1) * limit, page * limit),
        total,
        code: 0
      }
    }
  }
]
