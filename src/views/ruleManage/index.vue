<template>
  <div class="rule-manage-page app-container">
    <section-title title="规则定义" />
    <div class="rule-manage-page__header">
      <el-form :model="formData" :inline="true" class="common-form" label-width="75px">
        <el-row>
          <el-form-item label="规则属性:">
            <el-select v-model="formData.property" size="small" placeholder="请选择属性">
              <el-option label="强规则" value="strong" />
              <el-option label="弱规则" value="weak" />
            </el-select>
          </el-form-item>
          <el-form-item label="规则类型:">
            <el-select v-model="formData.type" size="small" placeholder="请选择类型">
              <el-option label="发件邮箱" value="send" />
              <el-option label="收件邮箱" value="receive" />
            </el-select>
          </el-form-item>
          <el-form-item label="源数据:">
            <el-input v-model="formData.source" size="small" placeholder="请输入源数据" />
          </el-form-item>
          <el-form-item label="关联邮件:">
            <el-select v-model="formData.relateEmail" size="small" placeholder="请选择关联邮件">
              <el-option label="发件邮箱" value="send" />
              <el-option label="收件邮箱" value="receive" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="关系:">
            <el-select v-model="formData.relative" size="small" placeholder="请选择关系">
              <el-option label="并且" value="and" />
              <el-option label="或者" value="or" />
            </el-select>
          </el-form-item>
          <el-form-item label="表达式:">
            <el-select v-model="formData.expression" size="small" placeholder="请选择表达式">
              <el-option label="单条件" value="single" />
              <el-option label="多条件" value="multiple" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属组织:">
            <el-select v-model="formData.apt" size="small" placeholder="请选择所属组织">
              <el-option label="APT32" value="apt32" />
              <el-option label="APT8" value="apt8" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="success" size="small">查询</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="rule-manage-page__content">
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
        <el-table v-loading="loading" :data="tableData" class="common-table" stripe>
          <el-table-column
            type="selection"
            width="50"
            align="center"
          />
          <el-table-column v-for="(label, index) in headers" :key="index" :label="label" :prop="keys[index]" align="center" :show-overflow-tooltip="true" />
          <el-table-column label="表达式" align="center" width="90">
            <template slot-scope="{ row }">
              <p>{{ row.subRules | expression }}</p>
            </template>
          </el-table-column>
          <el-table-column label="关系" align="center" width="90">
            <template slot-scope="{ row }">
              <p>{{ row.relation }}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="{ row }">
              <el-button type="primary" size="mini" plain @click="edit(row)">编辑</el-button>
              <el-button type="danger" size="mini" plain @click="del(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </pagination>
    </div>
    <el-dialog :visible.sync="dialogTableVisible" :fullscreen="fullscreen" top="100px" width="40%" class="common-dialog">
      <div slot="title" style="display: flex; justify-content: space-between; height: 16px; align-items: center">
        <p>添加规则</p>
        <el-button icon="el-icon-full-screen" type="text" style="margin-right: 30px" @click="fullscreen = !fullscreen" />
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
import { getRuleList } from '../../api/ruleManage'

export default {
  name: 'Index',
  filters: {
    expression(rules) {
      return rules.length === 0 ? '单条件' : '多条件'
    }
  },
  data() {
    return {
      formData: {
        property: '',
        type: '',
        source: '',
        relative: '',
        expression: '',
        apt: '',
        relateEmail: ''
      },
      keys: ['id', 'type', 'eqSource', 'attr', 'aptName', 'emailId', 'subRules', 'relation'],
      headers: ['ID', '规则类型', '源数据', '规则属性', '所属于组织', '关联邮件'],
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
        const res = await getRuleList({ page: this.page, limit: this.limit, pid: 0 })
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
    .option {
      margin-bottom: 10px;
    }
  }
}
</style>
