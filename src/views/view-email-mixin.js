import { getEmail, getCommentList, addComment, checkRule } from '@/api/emailManage'

export default {
  data() {
    return {
      emailDialogTableVisible: false,
      ruleDialogTableVisible: false,
      ruleDialogHeaders: ['规则属性', '规则类型', '匹配源数据', '所属组织', '关联邮件'],
      ruleDialogKeys: ['attr', 'type', 'value', 'aptName', 'emailId'],
      ruleDialogWidths: ['100', '100', '', '100', ''],
      ruleFullscreen: false,
      rule: null,
      curData: null,
      commentPage: 1,
      commentLimit: 10,
      commentList: [],
      userName: 'admin',
      emailId: -1,
      content: ''
    }
  },
  methods: {
    async checkEmail(dataOrId) {
      const type = Object.prototype.toString.call(dataOrId)
      let data = null
      if (type === '[object Object]') {
        data = dataOrId
        this.emaildId = dataOrId.emailId
      } else {
        this.emaildId = dataOrId
        const res = await getEmail(dataOrId)
        data = res.data
      }
      this.curData = []
      const keys = ['发件邮箱', '发件IP', '收件邮箱', '发件时间', '邮件标题', '邮件正文', '邮件附件', '分析结果', '添加源数据', '关联邮件']
      const maps = ['fromAdd', 'fromIp', 'toAdd', 'date', 'subject', 'content', 'attachments']
      maps.slice(0, 6).forEach((k, index) => {
        const obj = {
          key: keys[index],
          flag: false,
          value: data[k]
        }
        this.curData.push(obj)
      })
      this.curData.push({
        key: keys[6],
        value: data.attachments,
        flag: true
      })
      this.curData.push({
        key: keys[7],
        value: data.trace ? data.trace.rules : '',
        flag: !!data.trace
      })
      let addRule = ''
      let emailId = ''
      if (data.trace) {
        addRule = data.trace.addRule ? '是' : '否'
        emailId = data.trace.emailId
      }
      this.curData.push({
        key: keys[8],
        value: addRule,
        flag: false
      })
      this.curData.push({
        key: keys[9],
        value: emailId,
        flag: false
      })
      this.getComments()
      this.emailDialogTableVisible = true
    },
    closeDialog() {
      this.emailDialogTableVisible = false
      this.content = ''
      this.curData = null
      this.commentList = []
    },
    getComments() {
      getCommentList({ page: this.commentPage, limit: this.commentLimit }).then((res) => {
        this.commentList.push(...res.data)
      })
    },
    addComment() {
      const data = {
        userName: this.userName,
        emailId: this.emailId,
        content: this.content,
        date: this.getDate()
      }
      addComment(data).then((res) => {
        this.commentList.unshift(res.data)
      })
    },
    getDate() {
      return new Date().toLocaleString('chinese', { hour12: false }).replace(/\//g, '-')
    },
    download(item) {
    },
    viewRule(rule) {
      checkRule(rule.id).then((res) => {
        res.data.attr = this.dic.attr[res.data.attr]
        res.data.type = this.dic.types[res.data.type]
        this.rule = [res.data]
        this.ruleDialogTableVisible = true
      })
    }
  }
}
