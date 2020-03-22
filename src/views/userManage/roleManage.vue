<template>
  <div class="role-manage-page app-container">
    <el-card class="role-manage-page__header">
      <el-form :model="formData" :inline="true">
        <el-form-item label="角色名称">
          <el-input v-model="formData.name" size="small" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="formData.description" size="small" placeholder="请输入角色描述" />
        </el-form-item>
        <el-form-item label="英文名称">
          <el-input v-model="formData.enName" size="small" placeholder="请输入英文名称" />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" size="small" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="role-manage-page__content">
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
          <el-table-column
            v-for="(label, index) in headers"
            :key="index"
            :label="label"
            :prop="keys[index]"
            align="center"
            :show-overflow-tooltip="true"
          />
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
        <p>添加角色信息</p>
        <el-button
          icon="el-icon-full-screen"
          type="text"
          style="margin-right: 20px; color: #909399"
          @click="fullscreen = !fullscreen"
        />
      </div>
      <el-form :model="roleForm" label-width="90px">
        <el-form-item label="角色名称">
          <el-input v-model="roleForm.name" size="small" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" size="small" placeholder="请输入角色描述" />
        </el-form-item>
        <el-form-item label="英文名称">
          <el-input v-model="roleForm.enName" size="small" placeholder="请输入英文名称" />
        </el-form-item>
        <el-form-item label="角色权限">
          <el-tree
            :data="roleForm.permission"
            show-checkbox
            node-key="id"
          />
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
import { getRoles } from '../../api/userManage'

export default {
  name: 'RoleManage',
  data() {
    return {
      formData: {
        name: '',
        description: '',
        enName: ''
      },
      tableData: null,
      headers: ['ID', '角色名称', '角色描述', '英文名称'],
      keys: ['id', 'name', 'description', 'enName'],
      page: 1,
      limit: 8,
      total: 0,
      loading: false,
      fullscreen: false,
      dialogTableVisible: false,
      roleForm: {
        name: '',
        description: '',
        enName: '',
        permission: [
          {
            id: 1,
            label: '用户',
            children: [
              {
                id: 3,
                label: '角色管理',
                children: [{
                  id: 4,
                  label: '三级 3-1-1'
                }, {
                  id: 5,
                  label: '三级 3-1-2'
                }]
              }, {
                id: 2,
                label: '资源管理',
                children: [
                  {
                    id: 6,
                    label: '查看'
                  }, {
                    id: 7,
                    label: '删除'
                  }, {
                    id: 8,
                    label: '修改'
                  }, {
                    id: 9,
                    label: '添加'
                  }]
              }, {
                id: 10,
                label: '用户管理'
              }]
          }, {
            id: 11,
            label: '报告'
          }, {
            id: 12,
            label: 'TTP'
          }]
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
        const res = await getRoles({ page: this.page, limit: this.limit })
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
  .role-manage-page {
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
