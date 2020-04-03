<template>
  <div class="attach-page app-container">
    <section-title title="附件管理" />
    <el-form :model="formData" :inline="true" label-width="75px" class="common-form">
      <el-row>
        <el-form-item label="文件名:">
          <el-input v-model="formData.filename" size="small" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="哈希:">
          <el-input v-model="formData.filename" size="small" placeholder="请输入hash" />
        </el-form-item>
        <el-form-item label="所属邮件:">
          <el-input v-model="formData.filename" size="small" placeholder="请输入所属邮件" />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="success" size="small">查询</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <div class="attach-page__content">
      <div class="option">
        <el-button size="small" type="danger" @click="deleteMoreAttachment">删除</el-button>
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
              <el-button type="danger" size="mini" @click="deleteOneAttachment(row, $index)" plain>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </pagination>
    </div>
  </div>
</template>

<script>
import { delAttachment, delAttachments, getAttachmentList } from '../../api/emailManage'

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
      keys: ['id', 'name', 'size', 'path', 'emailHash', 'emailId'],
      headers: ['ID', '文件名', '文件大小(KB)', '路径', '哈希', '所属邮件'],
      widths: ['70', '', '120', '', '', ''],
      selections: []
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.loading = true
      setTimeout(async() => {
        const res = await getAttachmentList({ page: this.page, limit: this.limit })
        this.tableData = res.data
        this.total = res.count
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
    handleSelectionChange(val) {
      this.selection = val.map(item => item.id)
    },
    deleteOneAttachment(data, index) {
      delAttachment(data.id).then((res) => {
        if (res.code === 0) {
          this.tableData.splice(index, 1)
        }
      })
    },
    deleteMoreAttachment() {
      delAttachments(this.selection).then((res) => {
        if (res.code === 0) {
          this.tableData = this.tableData.filter((item) => {
            return this.selection.indexOf(item.id) === -1
          })
        }
      })
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
