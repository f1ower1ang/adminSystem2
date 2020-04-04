<template>
  <div class="attach-page app-container">
    <section-title title="附件管理" />
    <el-form :model="formData" :inline="true" label-width="75px" class="common-form">
      <el-row>
        <el-form-item label="文件名:">
          <el-input v-model="formData.name" size="small" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="哈希:">
          <el-input v-model="formData.md5" size="small" placeholder="请输入hash" />
        </el-form-item>
        <el-form-item label="所属邮件:">
          <el-input v-model="formData.emailId" size="small" placeholder="点击选择所属邮件" disabled>
            <el-button slot="append" icon="el-icon-search" @click="getEmailData" />
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="success" size="small" @click="search">查询</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <div class="attach-page__content">
      <div class="option">
        <el-button size="small" type="danger" @click="deleteMoreItem">删除</el-button>
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
          <el-table-column
            v-for="(label, index) in headers"
            :key="index"
            :label="label"
            :prop="keys[index]"
            align="center"
            :width="widths[index]"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="{ row, $index }">
              <el-button type="primary" size="mini" plain>下载</el-button>
              <el-button type="danger" size="mini" plain @click="deleteOneItem(row, $index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </pagination>
    </div>
    <el-dialog :visible.sync="searchDialog" :fullscreen="searchFullScreen" top="100px" width="50%" class="common-dialog">
      <div slot="title" style="display: flex; justify-content: space-between; height: 16px; align-items: center">
        <p>邮件搜索</p>
        <el-button icon="el-icon-full-screen" type="text" style="margin-right: 30px" @click="searchFullScreen = !searchFullScreen" />
      </div>
      <el-form :model="searchForm" inline label-width="90px">
        <el-form-item label="邮件路径:">
          <el-input v-model="searchForm.filePath" size="small" type="email" placeholder="请输入邮件路径" />
        </el-form-item>
        <el-form-item label="发件人邮箱:">
          <el-input v-model="searchForm.fromAdd" size="small" placeholder="请输入发件人邮箱" />
        </el-form-item>
        <el-form-item label="发件IP:">
          <el-input v-model="searchForm.fromIp" size="small" placeholder="请输入发件IP" />
        </el-form-item>
        <el-form-item label="邮件标题:">
          <el-input v-model="searchForm.subject" size="small" placeholder="请输入邮件标题" />
        </el-form-item>
        <el-form-item>
          <el-button size="small" icon="el-icon-search" type="success" @click="searchEmail">查询</el-button>
        </el-form-item>
      </el-form>
      <pagination
        :total="searchTotal"
        :page="searchPage"
        :size="searchLimit"
        @select-page="changeSearchPage"
        @select-size="changeSearchSize"
      >
        <el-table v-loading="searchLoading" :data="emailData" class="common-table" stripe>
          <el-table-column v-for="(header, index) in searchHeaders" :key="index" :label="header" :prop="searchKeys[index]" align="center" show-overflow-tooltip />
          <el-table-column label="操作" width="90" align="center">
            <template slot-scope="{ row }">
              <el-button type="primary" size="mini" plain @click="selectEmail(row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
      </pagination>
    </el-dialog>
  </div>
</template>

<script>
import { deleteAttachments, deleteAttachment, getAttachmentList, getEmailList } from '../../api/emailManage'
import CommonMixin from '../common-mixin'

export default {
  name: 'Attach',
  mixins: [CommonMixin],
  data() {
    return {
      formData: {
        name: '',
        md5: '',
        emailId: ''
      },
      keys: ['id', 'name', 'size', 'path', 'emailHash', 'emailId'],
      headers: ['ID', '文件名', '文件大小(KB)', '路径', '哈希', '所属邮件'],
      widths: ['70', '', '120', '', '', ''],
      searchDialog: false,
      searchFullScreen: false,
      searchForm: {
        filePath: '',
        fromAdd: '',
        fromIp: '',
        subject: ''
      },
      getItems: getAttachmentList,
      delItem: deleteAttachment,
      delItems: deleteAttachments,
      searchHeaders: ['邮件路径', '发件邮箱', '发件IP', '邮件标题'],
      searchKeys: ['filePath', 'fromAdd', 'fromIp', 'subject'],
      searchLoading: false,
      searchPage: 1,
      searchLimit: 8,
      searchTotal: 0,
      emailData: null
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getEmailData() {
      this.searchDialog = true
      this.searchLoading = true
      const data = {}
      Object.assign(data, this.searchForm, {
        page: this.searchPage,
        limit: this.searchLimit
      })
      getEmailList(data).then((res) => {
        this.emailData = res.data.map((item) => {
          return {
            emailId: item.id,
            filePath: item.filePath,
            subject: item.subject,
            fromAdd: item.fromAdd,
            fromIp: item.fromIp
          }
        })
        this.searchTotal = res.count
        this.searchLoading = false
      })
    },
    searchEmail() {
      this.searchPage = 1
      this.searchLimit = 1
      this.getEmailData()
    },
    closeSearch() {
      this.searchDialog = false
      this.emailData = null
      this.searchTotal = 0
      this.searchPage = 1
      this.searchLimit = 8
      this.searchForm = this.$options.data().searchForm
    },
    changeSearchPage(page) {
      this.searchPage = page
      this.getEmailData()
    },
    changeSearchSize(size) {
      this.searchLimit = size
      this.getEmailData()
    },
    selectEmail(email) {
      this.formData.emailId = email.emailId
      this.closeSearch()
    }
  }
}
</script>

<style scoped lang="scss">
.attach-page {
  &__content {
    .option {
      margin-bottom: 20px;
    }
  }
}
</style>
