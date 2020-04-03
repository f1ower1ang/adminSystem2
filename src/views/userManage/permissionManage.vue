<template>
  <div class="permission-manage-page app-container">
    <section-title title="权限管理" />
    <div class="permission-manage-page__header">
      <el-form :model="formData" :inline="true" label-width="75px" class="common-form">
        <el-row>
          <el-form-item label="资源名称:">
            <el-input v-model="formData.name" size="small" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="资源URL:">
            <el-input v-model="formData.url" size="small" placeholder="请输入真实姓名" />
          </el-form-item>
          <el-form-item label="资源类型:">
            <el-select v-model="formData.type" size="small" placeholder="请选择状态">
              <el-option label="菜单" value="1" />
              <el-option label="按钮" value="2" />
              <el-option label="接口" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" size="small">查询</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="permission-manage-page__content">
      <div class="option">
        <el-button size="small" type="danger" @click="deleteMorePermission">删除</el-button>
        <el-button size="small" type="primary" @click="showDialog">添加</el-button>
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
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="{ row, $index }">
              <el-button type="primary" plain size="mini" @click="edit(row)">编辑</el-button>
              <el-button type="danger" plain size="mini" @click="deleteOnePermission(row, $index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </pagination>
    </div>
    <el-dialog :visible.sync="dialogTableVisible" :fullscreen="fullscreen" top="225px" width="40%" class="common-dialog">
      <div slot="title" style="display: flex; justify-content: space-between; height: 16px; align-items: center">
        <p>添加资源信息</p>
        <el-button icon="el-icon-full-screen" type="text" style="margin-right: 30px;" @click="fullscreen = !fullscreen" />
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
            <el-option label="菜单" value="1" />
            <el-option label="按钮" value="2" />
            <el-option label="接口" value="3" />
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
import { deletePermission, deletePermissions, getPermissionList } from '../../api/userManage'

export default {
  name: 'PermissionManage',
  data() {
    return {
      formData: {
        name: '',
        type: '',
        url: ''
      },
      tableData: null,
      headers: ['ID', '资源名称', '资源URL', '上级资源', '资源类型'],
      keys: ['id', 'name', 'url', 'pid', 'type'],
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
      },
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
        const res = await getPermissionList({ page: this.page, limit: this.limit })
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
    deleteMorePermission() {
      deletePermissions(this.selection).then((res) => {
        if (res.code === 0) {
          this.tableData = this.tableData.filter((item) => this.selection.indexOf(item.id) === -1)
        }
      })
    },
    showDialog() {
      this.dialogTableVisible = true
    },
    edit(item) {
    },
    deleteOnePermission(perm, index) {
      deletePermission(perm.id).then((res) => {
        if (res.code === 0) {
          this.tableData.splice(index, 1)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.permission-manage-page {
  &__content {
    .option {
      margin-bottom: 10px
    }
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
