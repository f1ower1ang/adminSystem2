<template>
  <div class="record-page app-container">
    <section-title title="分析记录" />
    <div class="record-page__header">
      <el-form :model="formData" :inline="true" class="common-form" label-width="75px">
        <el-row>
          <el-form-item label="发件邮箱:">
            <el-input v-model="formData.email" size="small" placeholder="请输入邮箱" type="email" />
          </el-form-item>
          <el-form-item>
            <p slot="label" style="text-align: center">发件IP:</p>
            <el-input v-model="formData.ip" size="small" placeholder="请输入ip" />
          </el-form-item>
          <el-form-item label="邮件标题:">
            <el-input v-model="formData.title" size="small" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label="所属组织:">
            <el-select v-model="formData.apt" size="small" placeholder="请选择组织">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="分析日期:">
            <el-input v-model="formData.startDate" size="small" placeholder="请输入起始日期" />
          </el-form-item>
          <el-form-item>
            <p slot="label" style="text-align: center">至</p>
            <el-input v-model="formData.endDate" size="small" placeholder="请输入截止日期" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="success" size="small">搜索</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="option">
      <el-button type="danger" size="small" @click="deleteMoreRule">删除</el-button>
    </div>
    <div class="record-page__content">
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
          <el-table-column label="文件名" prop="emailId" align="center" />
          <el-table-column label="分析结果" align="center">
            <template slot-scope="{ row }">
              <p v-for="(rule, index) in row.rules" :key="index" style="line-height: 35px">
                {{ rule.attr }}:{{ rule.aptName }}
                <el-button size="mini" type="primary" plain style="padding: 5px 10px; margin-left: 5px;" @click="viewRule(rule)">查看</el-button>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="添加源数据" align="center">
            <template slot-scope="{ row }">
              <p :class="!row.addRule ? 'color-red': 'color-green'">{{ row.addRule | toWords }}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row, $index }">
              <el-button type="danger" size="mini" plain @click="deleteOneRule(row, $index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </pagination>
    </div>
    <el-dialog :visible.sync="dialogTableVisible" :fullscreen="fullscreen" top="250px">
      <div slot="title" style="display: flex; justify-content: space-between; height: 16px; align-items: center">
        <p>查看依据</p>
        <el-button icon="el-icon-full-screen" type="text" style="margin-right: 20px; color: #909399" @click="fullscreen = !fullscreen" />
      </div>
      <el-table :data="curData" border @selection-change="handleSelectionChange">
        <el-table-column v-for="(header, index) in dialogHeaders" :key="index" :label="header" :prop="dialogKeys[index]" align="center" :width="widths[index]" show-overflow-tooltip />
      </el-table>
      <div slot="footer">
        <el-button size="small" @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="dialogTableVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { checkRule, getRecordList } from '../../api/emailTrace'

export default {
  name: 'Record',
  filters: {
    toWords(flag) {
      return flag ? '是' : '否'
    }
  },
  data() {
    return {
      formData: {
        email: '',
        ip: '',
        title: '',
        apt: '',
        startDate: '',
        endDate: ''
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
      headers: ['文件名'],
      keys: ['emailId', 'rules', 'addRule'],
      dialogHeaders: ['规则属性', '规则类型', '匹配源数据', '所属组织', '关联邮件'],
      dialogKeys: ['attr', 'type', 'value', 'aptName', 'emailId'],
      widths: ['100', '100', '', '100', ''],
      tableData: null,
      dialogTableVisible: false,
      fullscreen: false,
      curData: null,
      selection: []
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.loading = true
      setTimeout(async() => {
        const res = await getRecordList({ page: this.page, limit: this.limit })
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
    viewRule(rule) {
      checkRule(rule.id).then((res) => {
        this.curData = [res.data]
        this.dialogTableVisible = true
      })
    },
    deleteOneRule(rule, index) {
    },
    deleteMoreRule() {
    }
  }
}
</script>

<style scoped lang="scss">
.record-page {
  &__content {
    margin-top: 10px;
  }
}
</style>
