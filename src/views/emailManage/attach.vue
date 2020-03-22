<template>
  <div class="attach-page app-container">
    <el-card class="attach-page__header">
      <el-form :model="formData" :inline="true">
        <el-form-item label="文件名">
          <el-input v-model="formData.filename" size="small" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="哈希">
          <el-input v-model="formData.filename" size="small" placeholder="请输入hash" />
        </el-form-item>
        <el-form-item label="所属邮件">
          <el-input v-model="formData.filename" size="small" placeholder="请输入所属邮件" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="attach-page__content">
      <div class="option">
        <el-button size="small" type="danger">删除</el-button>
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
            <template slot-scope="{ row }">
              <el-button type="primary" size="mini">下载</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </pagination>
    </el-card>
  </div>
</template>

<script>
import { emailAttach } from '../../api/emailManage'

export default {
  name: 'Attach',
  data() {
    return {
      formData: {
        filename: '',
        fileHash: '',
        belongTo: ''
      },
      page: 1,
      limit: 8,
      total: 0,
      loading: false,
      tableData: null,
      keys: ['id', 'filename', 'size', 'path', 'hash', 'email'],
      headers: ['ID', '文件名', '文件大小', '路径', '哈希', '所属邮件'],
      widths: ['70', '', '80', '', '', '']
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.loading = true
      setTimeout(async() => {
        const res = await emailAttach({ page: this.page, limit: this.limit })
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
    }
  }
}
</script>

<style scoped lang="scss">
.attach-page {
  &__header {
    .el-form-item {
      margin-bottom: 0;
    }
  }
  &__content {
    margin-top: 20px;
  }
}
</style>
