import path from '../src/assets/js/path'

export default [
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
