<template>
  <div class="email-manage-page app-container">
    <section-title title="邮件管理" />
    <el-form :model="formData" :inline="true" label-width="75px" class="common-form">
      <el-row>
        <el-form-item label="发件邮箱:">
          <el-input v-model="formData.fromAdd" size="small" type="email" placeholder="请输入发件邮箱" />
        </el-form-item>
        <el-form-item label="发件IP:">
          <el-input v-model="formData.fromIp" size="small" placeholder="请输入发件IP" />
        </el-form-item>
        <el-form-item label="邮件标题:">
          <el-input v-model="formData.subject" size="small" placeholder="请输入邮件标题" />
        </el-form-item>
        <el-form-item label="邮件正文:">
          <el-input v-model="formData.content" size="small" placeholder="请输入邮件正文" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="所属组织:">
          <el-select v-model="formData.aptName" size="small" placeholder="请选择所属组织">
            <template v-if="dic.APT">
              <el-option v-for="(aptName, index) in dic.APT" :key="index" :label="aptName" :value="aptName" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="发件日期:">
          <el-date-picker
            v-model="formData.startDate"
            style="width: 100%"
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            placeholder="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item>
          <p slot="label" style="text-align: center">至</p>
          <el-date-picker
            v-model="formData.endDate"
            style="width: 100%"
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            placeholder="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="是否查看" style="min-width: 19.5%;">
          <el-radio-group v-model="formData.read">
            <el-radio label="">全部</el-radio>
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-button icon="el-icon-search" type="success" size="small" @click="search">查询</el-button>
      </el-row>
    </el-form>
    <div class="email-manage-page__content">
      <div class="option">
        <el-button size="small" type="danger" @click="deleteMoreItem">删除</el-button>
        <el-button size="small" type="primary">统计分析</el-button>
      </div>
      <pagination
        :size="limit"
        :total="total"
        :page="page"
        @select-page="changePage"
        @select-size="changeSize"
      >
        <el-table v-loading="loading" :data="tableData" class="common-table" stripe :cell-style="{fontSize: '12px'}" @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="50"
            align="center"
          />
          <el-table-column v-for="(label, index) in headers" :key="index" :label="label" :prop="keys[index]" :width="widths[index]" align="center" show-overflow-tooltip />
          <el-table-column label="分析结果" width="180" align="center">
            <template v-if="row.trace" slot-scope="{ row }">
              <p v-for="(item, index) in row.trace.rules || []" :key="index" style="line-height: 35px">
                {{ dic.attr[item.attr] }}:{{ item.aptName }}
                <el-button size="mini" type="primary" plain style="padding: 5px 10px; margin-left: 5px;" @click="viewRule(item)">查看</el-button>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="添加源数据" width="90" align="center">
            <template slot-scope="{ row }">
              <p :class="!row.trace || !row.trace.addRule ? 'color-red': 'color-green'">{{ row.trace | toWords }}</p>
            </template>
          </el-table-column>
          <el-table-column label="是否查看" width="80" align="center">
            <template slot-scope="{ row }">
              <p :class="!row.read ? 'color-red': 'color-green'">{{ row.read | toWords }}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="210" align="center">
            <template slot-scope="{ row, $index }">
              <el-button type="primary" size="mini" plain @click="check(row)">查看</el-button>
              <el-button type="success" size="mini" plain>记录</el-button>
              <el-button type="danger" size="mini" plain @click="deleteOneItem(row, $index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </pagination>
    </div>
    <el-dialog :visible.sync="dialogTableVisible" :fullscreen="fullscreen" top="55px" class="common-dialog">
      <div slot="title" style="display: flex; justify-content: space-between; height: 16px; align-items: center">
        <p>查看邮件</p>
        <el-button icon="el-icon-full-screen" type="text" style="margin-right: 30px" @click="fullscreen = !fullscreen" />
      </div>
      <el-table :data="curData" border :show-header="false">
        <el-table-column property="key" width="150" align="center" />
        <el-table-column>
          <template slot-scope="{ row }">
            <div v-if="row.flag">
              <p v-for="(item, index) in row.value" :key="index" style="line-height: 35px">
                {{ dic.attr[item.attr] }}:{{ item.aptName }}
                <el-button size="mini" type="primary" plain style="padding: 5px 10px; margin-left: 5px;" @click="viewRule(item)">查看</el-button>
              </p>
            </div>
            <div v-else style="white-space: pre-wrap;" v-html="row.value" />
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button size="small" @click="emailDialogTableVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="emailDialogTableVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="ruleDialogTableVisible" :fullscreen="ruleFullscreen" top="250px" class="common-dialog">
      <div slot="title" style="display: flex; justify-content: space-between; height: 16px; align-items: center">
        <p>查看依据</p>
        <el-button icon="el-icon-full-screen" type="text" style="margin-right: 30px" @click="ruleFullscreen = !ruleFullscreen" />
      </div>
      <el-table :data="rule" border>
        <el-table-column v-for="(header, index) in dialogHeaders" :key="index" :label="header" :prop="dialogKeys[index]" align="center" :width="dialogWidths[index]" show-overflow-tooltip />
      </el-table>
      <div slot="footer">
        <el-button size="small" @click="ruleDialogTableVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="ruleDialogTableVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { checkRule, deleteEmail, deleteEmails, getEmailList } from '../../api/emailManage'
import { getAptList } from '../../api/ruleManage'
import CommonMixin from '../common-mixin'

export default {
  name: 'Index',
  filters: {
    toWords(flag) {
      const type = Object.prototype.toString.call(flag)
      if (type === '[object Object]') {
        if (flag.addRule) {
          return flag.addRule ? '是' : '否'
        } else {
          return '否'
        }
      } else {
        return flag ? '是' : '否'
      }
    }
  },
  mixins: [CommonMixin],
  data() {
    return {
      formData: {
        fromAdd: '',
        fromIp: '',
        subject: '',
        content: '',
        aptName: '',
        startDate: '',
        endDate: '',
        read: ''
      },
      headers: ['ID', '发件邮箱', '发件IP', '邮件标题', '发件日期', '所属组织'],
      keys: ['id', 'fromAdd', 'fromIp', 'subject', 'date', 'aptName', 'trace', 'read'],
      widths: ['70', '', '130', '', '100', '', '', '100'],
      curData: null,
      ruleDialogTableVisible: false,
      rule: null,
      dialogHeaders: ['规则属性', '规则类型', '匹配源数据', '所属组织', '关联邮件'],
      dialogKeys: ['attr', 'type', 'value', 'aptName', 'emailId'],
      dialogWidths: ['100', '100', '', '100', ''],
      ruleFullscreen: false,
      getItems: getEmailList,
      delItem: deleteEmail,
      delItems: deleteEmails
    }
  },
  async created() {
    this.loading = true
    const res = await getAptList({ limit: 9999, page: 1 })
    this.dic.APT = []
    res.data.forEach((res) => {
      this.dic.APT.push(res.name)
    })
    this.getTableData()
  },
  methods: {
    check(data) {
      this.curData = []
      const keys = ['发件邮箱', '发件IP', '收件邮箱', '发件时间', '邮件标题', '邮件正文', '邮件附件', '分析结果', '添加源数据', '关联邮件']
      const maps = ['fromAdd', 'fromIp', 'toAdd', 'date', 'subject', 'content', 'attachments']
      maps.slice(0, 7).forEach((k, index) => {
        const obj = {
          key: keys[index],
          flag: false,
          value: data[k]
        }
        this.curData.push(obj)
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
      this.emailDialogTableVisible = true
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
</script>

<style scoped lang="scss">
  .email-manage-page {
    background-color: #fff;
    &__content {
      .option {
        margin-bottom: 20px;
      }
    }
    .el-radio {
      margin-right: 10px;
    }
  }
</style>
