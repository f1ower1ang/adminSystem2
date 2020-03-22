<template>
  <div class="user-manage-page app-container">
    <el-card class="user-manage-page__header">
      <el-form :model="formData" :inline="true">
        <el-form-item label="用户名">
          <el-input v-model="formData.username" size="small" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="formData.realName" size="small" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="用户电话">
          <el-input v-model="formData.phone" size="small" placeholder="请输入用户电话" />
        </el-form-item>
        <el-form-item label="用户状态">
          <el-select v-model="formData.status" size="small" placeholder="请选择状态">
            <el-option label="正常" value="normal" />
            <el-option label="冻结" value="freeze" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" size="small" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="user-manage-page__content">
      <div class="option">
        <el-button size="small" type="danger">删除</el-button>
        <el-button size="small" type="primary" @click="showDialog">添加</el-button>
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
          <el-table-column v-for="(label, index) in headers" :key="index" :label="label" :prop="keys[index]" align="center" :show-overflow-tooltip="true" :width="widths[index]" />
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="{ row }">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(row)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </pagination>
    </el-card>
    <el-dialog :visible.sync="dialogTableVisible" :fullscreen="fullscreen" top="50px" width="40%">
      <div slot="title" style="display: flex; justify-content: space-between; height: 16px; align-items: center">
        <p>添加用户信息</p>
        <el-button icon="el-icon-full-screen" type="text" style="margin-right: 20px; color: #909399" @click="fullscreen = !fullscreen" />
      </div>
      <el-form :model="accountForm" label-width="90px">
        <el-form-item label="用户账号">
          <el-input v-model="accountForm.username" size="small" type="text" placeholder="请输入用户账号" />
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="accountForm.realName" size="small" type="text" placeholder="请输入用户账号" />
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input v-model="accountForm.password" size="small" type="password" placeholder="请输入用户账号" />
        </el-form-item>
        <el-form-item label="重复密码">
          <el-input v-model="accountForm.confirmPwd" size="small" type="password" placeholder="请输入用户账号" />
        </el-form-item>
        <el-form-item label="用户电话">
          <el-input v-model="accountForm.phone" size="small" placeholder="请输入用户账号" />
        </el-form-item>
        <el-form-item label="用户邮件">
          <el-input v-model="accountForm.email" size="small" placeholder="请输入用户账号" />
        </el-form-item>
        <el-form-item label="添加时间">
          <el-input v-model="accountForm.date" size="small" disabled placeholder="请输入用户账号" />
        </el-form-item>
        <el-form-item label="用户状态">
          <el-radio-group v-model="accountForm.status">
            <el-radio label="normal">正常</el-radio>
            <el-radio label="lock">锁定</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户角色">
          <el-select v-model="accountForm.role" size="small" placeholder="请选择用户角色">
            <el-option label="TTP管理员" value="apt32" />
            <el-option label="系统管理员" value="apt8" />
            <el-option label="普通用户" value="apt8" />
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
import { getAccounts } from '../../api/userManage'

export default {
  name: 'Index',
  data() {
    return {
      formData: {
        username: '',
        realName: '',
        phone: '',
        status: ''
      },
      tableData: null,
      headers: ['ID', '用户名', '真实姓名', '用户电话', '用户邮箱', '添加时间', '用户状态', '用户角色'],
      keys: ['id', 'username', 'realName', 'phone', 'email', 'date', 'status', 'role'],
      widths: ['70', '', '90', '', '', '', '90', '100'],
      page: 1,
      limit: 8,
      total: 0,
      loading: false,
      fullscreen: false,
      dialogTableVisible: false,
      accountForm: {
        username: '',
        realName: '',
        password: '',
        confirmPwd: '',
        phone: '',
        email: '',
        date: '',
        status: 'normal',
        role: ''
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
        const res = await getAccounts({ page: this.page, limit: this.limit })
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
    showDialog() {
      this.accountForm.date = this.getDate()
      this.dialogTableVisible = true
    },
    getDate() {
      return new Date().toLocaleString('chinese', { hour12: false }).replace(/\//g, '-')
    },
    edit(item) {
    },
    del(item) {
    }
  }
}
</script>

<style scoped lang="scss">
.user-manage-page {
  &__content {
    margin-top: 20px
  }
  .el-dialog {
    .el-form {
      .el-form-item {
        display: inline-block;
        width: 45%;
      }
    }
  }
}
</style>
