const path = require('../src/assets/js/path')

module.exports = [
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
