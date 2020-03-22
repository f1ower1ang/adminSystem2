<template>
  <div class="rule-manage-page app-container">
    <el-card class="rule-manage-page__header">
      <el-form :model="formData" :inline="true">
        <el-form-item label="规则属性">
          <el-select v-model="formData.property" size="small" placeholder="请选择属性">
            <el-option label="强规则" value="strong" />
            <el-option label="弱规则" value="weak" />
          </el-select>
        </el-form-item>
        <el-form-item label="规则类型">
          <el-select v-model="formData.type" size="small" placeholder="请选择类型">
            <el-option label="发件邮箱" value="send" />
            <el-option label="收件邮箱" value="receive" />
          </el-select>
        </el-form-item>
        <el-form-item label="源数据">
          <el-input v-model="formData.source" size="small" placeholder="请输入源数据" />
        </el-form-item>
        <el-form-item label="关系">
          <el-select v-model="formData.relative" size="small" placeholder="请选择关系">
            <el-option label="并且" value="and" />
            <el-option label="或者" value="or" />
          </el-select>
        </el-form-item>
        <el-form-item label="表达式">
          <el-select v-model="formData.expression" size="small" placeholder="请选择表达式">
            <el-option label="单条件" value="single" />
            <el-option label="多条件" value="multiple" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属组织">
          <el-select v-model="formData.apt" size="small" placeholder="请选择所属组织">
            <el-option label="APT32" value="apt32" />
            <el-option label="APT8" value="apt8" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" size="small" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="rule-manage-page__content">
      <div class="option">
        <el-button size="small" type="danger">删除</el-button>
        <el-button size="small" type="primary" @click="openDialog">添加</el-button>
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
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="{ row }">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(row)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </pagination>
    </el-card>
    <el-dialog :visible.sync="dialogTableVisible" :fullscreen="fullscreen" top="100px" width="40%">
      <div slot="title" style="display: flex; justify-content: space-between; height: 16px; align-items: center">
        <p>添加规则</p>
        <el-button icon="el-icon-full-screen" type="text" style="margin-right: 20px; color: #909399" @click="fullscreen = !fullscreen" />
      </div>
      <el-form :model="ruleForm" label-width="90px">
        <el-form-item label="关联邮件">
          <el-select v-model="ruleForm.relate" size="small" placeholder="请选择关联邮件">
            <el-option label="关联邮件选项1" value="choice1" />
            <el-option label="关联邮件选项2" value="choice2" />
          </el-select>
        </el-form-item>
        <el-form-item label="规则属性">
          <el-select v-model="ruleForm.property" size="small" placeholder="请选择属性">
            <el-option label="强规则" value="strong" />
            <el-option label="弱规则" value="weak" />
          </el-select>
        </el-form-item>
        <el-form-item label="规则表达式">
          <el-input v-model="ruleForm.expression" size="small" placeholder="请输入规则表达式" style="width: 70%" />
        </el-form-item>
        <el-form-item label="所属组织">
          <el-select v-model="ruleForm.apt" size="small" placeholder="请选择组织">
            <el-option label="APT32" value="apt32" />
            <el-option label="APT8" value="apt8" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="small" @click="dialogTableVisible = false">确 定</el-button>
        <el-button size="small" @click="dialogTableVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRuleDefinition } from '../../api/ruleManage'

export default {
  name: 'Index',
  data() {
    return {
      formData: {
        property: '',
        type: '',
        source: '',
        relative: '',
        expression: '',
        apt: ''
      },
      keys: ['id', 'type', 'source', 'property', 'apt', 'relate', 'expression', 'relationship'],
      headers: ['ID', '规则类型', '源数据', '规则属性', '所属于组织', '关联邮件', '表达式', '关系'],
      tableData: null,
      page: 1,
      limit: 8,
      total: 0,
      loading: false,
      fullscreen: false,
      dialogTableVisible: false,
      ruleForm: {
        relate: '',
        property: '',
        expression: '',
        apt: ''
      }
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.loading = true
      setTimeout(async() => {
        const res = await getRuleDefinition({ page: this.page, limit: this.limit })
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
    },
    openDialog() {
      this.dialogTableVisible = true
    }
  }
}
</script>

<style scoped lang="scss">
.rule-manage-page{
  &__content {
    margin-top: 20px;
  }
}
</style>
