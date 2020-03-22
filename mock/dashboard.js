const path = require('../src/assets/js/path')

module.exports = [
  {
    url: path.dashboard,
    type: 'post',
    response: () => {
      const { data } = require('./json/table')
      return {
        data,
        code: 0
      }
    }
  }
]
