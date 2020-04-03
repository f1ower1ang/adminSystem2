<template>
  <div class="target-manage-page app-container">
    <section-title title="受害者目标管理" />
    <div class="target-manage-page__header">
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
    </div>
    <div class="target-manage-page__content">
      <div class="option">
        <el-button size="small" type="danger" @click="deleteMoreTarget">删除</el-button>
        <el-button size="small" type="primary">添加</el-button>
        <el-button size="small" type="success">批量导入</el-button>
      </div>
      <pagination
        :size="limit"
        :total="total"
        :page="page"
        @select-page="changePage"
        @select-size="changeSize"
      >
        <el-table v-loading="loading" :data="tableData" class="common-table" stripe @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="50"
            align="center"
          />
          <el-table-column v-for="(label, index) in headers" :key="index" :label="label" :prop="keys[index]" align="center" :show-overflow-tooltip="true" />
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row, $index }">
              <el-button type="primary" plain size="mini" @click="edit(row)">编辑</el-button>
              <el-button type="danger" plain size="mini" @click="deleteOneTarget(row, $index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </pagination>
    </div>
  </div>
</template>

<script>
  import { delTarget, delTargets, getTargetList } from '../../api/ruleManage'

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
      keys: ['id', 'aptName', 'toAdd', 'organization', 'province'],
      page: 1,
      limit: 8,
      total: 0,
      loading: false,
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
        const res = await getTargetList({ page: this.page, limit: this.limit })
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
    handleSelectionChange(val) {
      this.selection = val.map(item => item.id)
    },
    edit(item) {
    },
    deleteOneTarget(item, index) {
      delTarget(item.id).then((res) => {
        if (res.code === 0) {
          this.tableData.splice(index, 1)
        }
      })
    },
    deleteMoreTarget() {
      delTargets(this.selection).then((res) => {
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
.target-manage-page {
  &__content {
    .option {
      margin-bottom: 10px;
    }
  }
}
</style>
