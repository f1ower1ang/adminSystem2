<template>
  <div class="record-page app-container">
    <el-card class="record-page__header">
      <el-form :model="formData" :inline="true">
        <el-form-item label="发件邮箱">
          <el-input v-model="formData.email" size="small" placeholder="请输入邮箱" type="email" />
        </el-form-item>
        <el-form-item label="发件IP">
          <el-input v-model="formData.ip" size="small" placeholder="请输入ip" />
        </el-form-item>
        <el-form-item label="邮件标题">
          <el-input v-model="formData.title" size="small" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="所属组织">
          <el-select v-model="formData.apt" size="small" placeholder="请选择组织">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分析日期">
          <el-input v-model="formData.date" size="small" placeholder="请输入日期" />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" size="small" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="record-page__content">
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
          <el-table-column v-for="(label, index) in headers" :key="index" :label="label" :prop="keys[index]" :show-overflow-tooltip="true" align="center" />
          <el-table-column label="操作" width="90" align="center">
            <template slot-scope="{ row }">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </pagination>
    </el-card>
  </div>
</template>

<script>
import { analyseRecord } from '../../api/emailTrace'

export default {
  name: 'Record',
  data() {
    return {
      formData: {
        email: '',
        ip: '',
        title: '',
        apt: '',
        date: ''
      },
      options: [
        {
          label: 'APT32',
          value: 'APT32'
        }
      ],
      limit: 8,
      total: 0,
      loading: false,
      page: 1,
      headers: ['文件名', '分析结果', '添加源数据'],
      keys: ['filename', 'result', 'flag'],
      tableData: null
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.loading = true
      setTimeout(async() => {
        const res = await analyseRecord({ page: this.page, limit: this.limit })
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
    del(item) {
    }
  }
}
</script>

<style scoped lang="scss">
.record-page {
  &__content {
    margin-top: 20px;
  }
}
</style>
