<template>
  <div class="target-manage-page app-container">
    <el-card class="target-manage-page__header">
      <el-form :model="formData" :inline="true">
        <el-form-item label="组织名称">
          <el-input v-model="formData.apt" size="small" placeholder="请输入组织名称" />
        </el-form-item>
        <el-form-item label="组织别名">
          <el-input v-model="formData.alias" size="small" placeholder="请输入组织别名" />
        </el-form-item>
        <el-form-item label="发起国家">
          <el-select v-model="formData.country" size="small" placeholder="请选择发起国家">
            <el-option label="美国" value="America" />
            <el-option label="日本" value="Japan" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" size="small" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="target-manage-page__content">
      <div class="option">
        <el-button size="small" type="danger">删除</el-button>
        <el-button size="small" type="primary">添加</el-button>
        <el-button size="small" type="primary">批量导入</el-button>
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
          <el-table-column v-for="(label, index) in headers" :key="index" :label="label" :prop="keys[index]" align="center" :show-overflow-tooltip="true" />
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row }">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(row)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </pagination>
    </el-card>
  </div>
</template>

<script>
import { targetManage } from '../../api/ruleManage'

export default {
  name: 'TargetManage',
  data() {
    return {
      formData: {
        email: '',
        province: '',
        unit: '',
        apt: ''
      },
      tableData: null,
      headers: ['ID', '组织名称', '收件邮箱', '单位', '省份'],
      keys: ['id', 'apt', 'email', 'unit', 'province'],
      page: 1,
      limit: 8,
      total: 0,
      loading: false
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.loading = true
      setTimeout(async() => {
        const res = await targetManage({ page: this.page, limit: this.limit })
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
    edit(item) {
    },
    del(item) {
    }
  }
}
</script>

<style scoped lang="scss">
.target-manage-page {
  &__content {
    margin-top: 20px
  }
}
</style>
