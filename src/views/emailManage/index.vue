<template>
  <div class="email-manage-page app-container">
    <el-card class="email-manage-page__header">
      <el-form :model="formData" :inline="true">
        <el-form-item label="发件邮箱">
          <el-input v-model="formData.sendEmail" size="small" type="email" placeholder="请输入发件邮箱" />
        </el-form-item>
        <el-form-item label="发件IP">
          <el-input v-model="formData.sendIP" size="small" placeholder="请输入发件IP" />
        </el-form-item>
        <el-form-item label="邮件标题">
          <el-input v-model="formData.emailTitle" size="small" placeholder="请输入邮件标题" />
        </el-form-item>
        <el-form-item label="所属组织">
          <el-select v-model="formData.APT" size="small" placeholder="请选择所属组织">
            <el-option label="APT32" value="APT32" />
            <el-option label="APT28" value="APT28" />
          </el-select>
        </el-form-item>
        <el-form-item label="发件日期">
          <el-input v-model="formData.sendDate" size="small" placeholder="请输入发件日期" />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" size="small" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="email-manage-page__content">
      <div class="option">
        <el-button size="small" type="danger">删除</el-button>
        <el-button size="small" type="primary">统计分析</el-button>
      </div>
      <pagination
        :size="limit"
        :total="total"
        :page="page"
        @select-page="changePage"
        @select-size="changeSize"
      >
        <el-table v-loading="loading" :data="tableData">
          <el-table-column
            type="selection"
            width="50"
            align="center"
          />
          <el-table-column v-for="(label, index) in headers" :key="index" :label="label" :prop="keys[index]" :width="widths[index]" align="center" :show-overflow-tooltip="true" />
          <el-table-column label="操作" width="250" align="center">
            <template slot-scope="{ row }">
              <el-button type="primary" size="mini" @click="check(row)">查看</el-button>
              <el-button type="primary" size="mini">记录</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </pagination>
    </el-card>
    <el-dialog :visible.sync="dialogTableVisible" :fullscreen="fullscreen" top="50px">
      <div slot="title" style="display: flex; justify-content: space-between; height: 16px; align-items: center">
        <p>查看邮件</p>
        <el-button icon="el-icon-full-screen" type="text" style="margin-right: 20px; color: #909399" @click="fullscreen = !fullscreen" />
      </div>
      <el-table :data="curData" border :show-header="false">
        <el-table-column property="key" width="150" align="center" />
        <el-table-column property="value" align="center" />
      </el-table>
      <div slot="footer">
        <el-button type="primary" @click="dialogTableVisible = false" size="small">确 定</el-button>
        <el-button @click="dialogTableVisible = false" size="small">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { emailManage } from '../../api/emailManage'

export default {
  name: 'Index',
  data() {
    return {
      formData: {
        sendEmail: '',
        sendIP: '',
        emailTitle: '',
        APT: '',
        sendDate: ''
      },
      tableData: null,
      headers: ['ID', '发件邮箱', '发件IP', '邮件标题', '发件日期', '所属组织', '溯源结果', '添加源数据'],
      keys: ['id', 'email', 'ip', 'title', 'date', 'apt', 'result', 'flag'],
      widths: ['70', '', '130', '', '100', '', '', '100'],
      page: 1,
      limit: 8,
      total: 0,
      loading: false,
      curData: null,
      dialogTableVisible: false,
      fullscreen: false
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.loading = true
      setTimeout(async() => {
        const res = await emailManage({ page: this.page, limit: this.limit })
        this.tableData = res.data
        this.total = res.total
        this.loading = false
      }, 200)
    },
    changePage(page) {
      this.page = page
      this.getTableData()
    },
    changeSize(size) {
      this.limit = size
      this.getTableData()
    },
    check(data) {
      this.curData = []
      const keys = ['发件邮箱', '发件IP', '收件邮箱', '发件时间', '邮件标题', '邮件正文', '邮件附件', '溯源结果', '添加源数据', '关联邮件']
      const maps = ['email', 'ip', 'receive', 'date', 'title', 'text', 'attach', 'result', 'flag', 'relate']
      maps.forEach((k, index) => {
        const obj = {
          key: keys[index],
          value: data[k]
        }
        this.curData.push(obj)
      })
      this.dialogTableVisible = true
    }
  }
}
</script>

<style scoped lang="scss">
  .email-manage-page {
    &__content {
      margin-top: 20px
    }
  }
</style>
