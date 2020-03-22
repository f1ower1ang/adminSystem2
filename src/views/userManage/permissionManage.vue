<template>
  <div class="permission-manage-page app-container">
    <el-card class="permission-manage-page__header">
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
    <el-card class="permission-manage-page__content">
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
          <el-table-column v-for="(label, index) in headers" :key="index" :label="label" :prop="keys[index]" align="center" :show-overflow-tooltip="true" />
          <el-table-column label="操作" align="center" width="200">
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
        <p>添加资源信息</p>
        <el-button icon="el-icon-full-screen" type="text" style="margin-right: 20px; color: #909399" @click="fullscreen = !fullscreen" />
      </div>
      <el-form :model="permissionForm" label-width="90px">
        <el-form-item label="上级资源">
          <el-select v-model="permissionForm.parent" size="small" placeholder="请选择上级资源">
            <el-option label="根" value="root" />
            <el-option label="茎" value="undefined" />
            <el-option label="叶" value="leaf" />
          </el-select>
        </el-form-item>
        <el-form-item label="资源类型">
          <el-select v-model="permissionForm.type" size="small" placeholder="请选择上级资源">
            <el-option label="接口" value="interface" />
          </el-select>
        </el-form-item>
        <el-form-item label="资源名称">
          <el-input v-model="permissionForm.name" size="small" placeholder="请输入资源名称" />
        </el-form-item>
        <el-form-item label="资源URL">
          <el-input v-model="permissionForm.URL" size="small" placeholder="请输入资源URL" />
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
import { getPermissions } from '../../api/userManage'

export default {
  name: 'PermissionManage',
  data() {
    return {
      formData: {
        username: '',
        realName: '',
        phone: '',
        status: ''
      },
      tableData: null,
      headers: ['ID', '资源名称', '资源URL', '上级资源', '资源类型'],
      keys: ['id', 'name', 'URL', 'parent', 'type'],
      page: 1,
      limit: 8,
      total: 0,
      loading: false,
      fullscreen: false,
      dialogTableVisible: false,
      permissionForm: {
        parent: '',
        type: '',
        name: '',
        URL: ''
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
        const res = await getPermissions({ page: this.page, limit: this.limit })
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
      this.dialogTableVisible = true
    },
    edit(item) {
    },
    del(item) {
    }
  }
}
</script>

<style scoped lang="scss">
.permission-manage-page {
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
