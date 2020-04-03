<template>
  <div class="group-manage-page app-container">
    <section-title title="组织管理" />
    <div class="group-manage-page__header">
      <el-form :model="formData" :inline="true" class="common-form" label-width="75px">
        <el-row>
          <el-form-item label="组织名称:">
            <el-input v-model="formData.apt" size="small" placeholder="请输入组织名称" />
          </el-form-item>
          <el-form-item label="组织别名:">
            <el-input v-model="formData.alias" size="small" placeholder="请输入组织别名" />
          </el-form-item>
          <el-form-item label="发起国家:">
            <el-select v-model="formData.country" size="small" placeholder="请选择发起国家">
              <el-option label="美国" value="America" />
              <el-option label="日本" value="Japan" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="success" size="small">搜索</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="group-manage-page__content">
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
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="{ row }">
              <el-button type="primary" plain size="mini" @click="edit(row)">编辑</el-button>
              <el-button type="danger" plain size="mini" @click="del(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </pagination>
    </div>
    <el-dialog :visible.sync="dialogTableVisible" :fullscreen="fullscreen" top="50px" class="common-dialog">
      <div slot="title" style="display: flex; justify-content: space-between; height: 16px; align-items: center">
        <p>添加组织信息</p>
        <el-button icon="el-icon-full-screen" type="text" style="margin-right: 30px;" @click="fullscreen = !fullscreen" />
      </div>
      <el-form :model="groupForm" label-width="90px">
        <el-form-item label="APT名称">
          <el-input v-model="groupForm.apt" placeholder="请输入APT名称" />
        </el-form-item>
        <el-form-item label="APT别名">
          <el-input v-model="groupForm.alias" placeholder="请输入APT别名" />
        </el-form-item>
        <el-form-item label="APT标志">
          <el-input v-model="groupForm.flag" placeholder="图片地址" style="width: calc(100% - 225px)" />
          <el-upload
            action="#"
            style="display: inline-block"
          >
            <el-button icon="el-icon-upload">上传图片</el-button>
          </el-upload>
          <el-button>查看图片</el-button>
        </el-form-item>
        <el-form-item label="发起者">
          <el-input v-model="groupForm.initiator" placeholder="请输入发起者" />
        </el-form-item>
        <el-form-item label="支持者">
          <el-input v-model="groupForm.apt" placeholder="请输入发起者" />
        </el-form-item>
        <el-form-item label="目标">
          <el-input v-model="groupForm.apt" placeholder="请输入目标" />
        </el-form-item>
        <el-form-item label="行业">
          <el-input v-model="groupForm.apt" placeholder="请输入行业" />
        </el-form-item>
        <el-form-item label="类型">
          <el-checkbox-group v-model="groupForm.type">
            <el-checkbox label="勒索诈骗" />
            <el-checkbox label="拒绝服务" />
            <el-checkbox label="蓄意破坏" />
            <el-checkbox label="间谍情报" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="活跃日期">
          <el-date-picker
            v-model="groupForm.date"
            type="date"
            placeholder="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="态势页展示">
          <el-switch
            v-model="groupForm.show"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="概况">
          <el-input v-model="groupForm.description" style="width: 100%" type="textarea" rows="4" />
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
import { aptManage } from '../../api/ruleManage'

export default {
  name: 'GroupManage',
  data() {
    return {
      formData: {
        apt: '',
        alias: '',
        country: ''
      },
      tableData: null,
      headers: ['ID', '组织名称', '组织别名', '发起国家'],
      keys: ['id', 'apt', 'alias', 'initiator'],
      page: 1,
      limit: 8,
      total: 0,
      loading: false,
      groupForm: {
        apt: '',
        alias: '',
        flag: '',
        initiator: '',
        sponsor: '',
        target: '',
        industry: '',
        type: [],
        date: '',
        show: false,
        description: ''
      },
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
        const res = await aptManage({ page: this.page, limit: this.limit })
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
.group-manage-page {
  &__content {
    .option {
      margin-bottom: 10px;
    }
  }
  .el-dialog {
    .el-form {
      .el-form-item {
        display: inline-block;
        width: 45%;
        &:nth-child(3), &:nth-child(8), &:last-child {
          width: 90%;
        }
      }
    }
  }
}
</style>
