<template>
  <div class="role-manage-page app-container">
    <section-title title="角色管理" />
    <div class="role-manage-page__header">
      <el-form :model="formData" :inline="true" class="common-form" labei-width="75px">
        <el-row>
          <el-form-item label="角色名称:">
            <el-input v-model="formData.name" size="small" placeholder="请输入角色名称" />
          </el-form-item>
          <el-form-item label="角色描述:">
            <el-input v-model="formData.description" size="small" placeholder="请输入角色描述" />
          </el-form-item>
          <el-form-item label="英文名称:">
            <el-input v-model="formData.enName" size="small" placeholder="请输入英文名称" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="success" size="small" @click="search">查询</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="role-manage-page__content">
      <div class="option">
        <el-button size="small" type="danger" @click="deleteMoreItem">删除</el-button>
        <el-button size="small" type="primary" @click="showDialog(null)">添加</el-button>
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
          <el-table-column
            v-for="(label, index) in headers"
            :key="index"
            :label="label"
            :prop="keys[index]"
            align="center"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="{ row, $index }">
              <el-button type="primary" plain size="mini" @click="showDialog(row, $index)">编辑</el-button>
              <el-button type="danger" plain size="mini" @click="deleteOneItem(row, $index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </pagination>
    </div>
    <el-dialog :visible.sync="dialogTableVisible" :fullscreen="fullscreen" top="225px" width="40%" class="common-dialog">
      <div slot="title" style="display: flex; justify-content: space-between; height: 16px; align-items: center">
        <p>{{ dialogTitle }}</p>
        <el-button
          icon="el-icon-full-screen"
          type="text"
          style="margin-right: 30px"
          @click="fullscreen = !fullscreen"
        />
      </div>
      <el-form ref="roleForm" :model="roleForm" label-width="90px" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" size="small" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" size="small" placeholder="请输入角色描述" />
        </el-form-item>
        <el-form-item label="英文名称" prop="enName">
          <el-input v-model="roleForm.enName" size="small" placeholder="请输入英文名称" />
        </el-form-item>
        <el-form-item label="角色权限" style="vertical-align: top">
          <el-tree
            ref="tree"
            :data="roleForm.menus"
            show-checkbox
            node-key="id"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="small" @click="addOrEditRole">确 定</el-button>
        <el-button size="small" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addRole, deleteRole, deleteRoles, editRole, getMenu, getRoleList } from '../../api/userManage'
import CommonMixin from '../common-mixin'

export default {
  name: 'RoleManage',
  mixins: [CommonMixin],
  data() {
    return {
      formData: {
        name: '',
        description: '',
        enName: ''
      },
      headers: ['ID', '角色名称', '角色描述', '英文名称'],
      keys: ['id', 'name', 'description', 'enName'],
      roleForm: {
        name: '',
        description: '',
        enName: '',
        menus: []
      },
      rules: {
        name: { required: true, message: '请输入角色名称', trigger: 'blur' },
        enName: { required: true, message: '请输入英文名称', trigger: 'blur' }
      },
      dialogTitle: '添加角色信息',
      checkedList: [],
      trees: null,
      delItem: deleteRole,
      delItems: deleteRoles,
      getItems: getRoleList
    }
  },
  async created() {
    this.loading = true
    getMenu({ pid: 0 }).then((res) => {
      let data = JSON.stringify(res.data)
      data = data.replace(/\"title\"/g, '"label"')
      this.trees = JSON.parse(data)
      this.roleForm.menus = this.trees
    })
    this.getTableData()
  },
  methods: {
    showDialog(role = null, index = -1) {
      this.editIndex = index
      this.dialogTitle = index === -1 ? '添加角色信息' : '编辑角色信息'
      this.checkedList.splice(0)
      if (this.editIndex !== -1) {
        Object.assign(this.roleForm, this.tableData[index])
        const dfs = (item) => {
          if (item.checked) {
            this.checkedList.push(item.id)
          }
          if (item.children.length > 0) {
            item.children.forEach((child) => {
              dfs(child)
            })
          }
        }
        role.menus.forEach((item) => {
          dfs(item)
        })
      }
      this.roleForm.menus = this.trees
      this.dialogTableVisible = true
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.checkedList)
      })
    },
    getCheckedTree(checkedList) {
      const ret = this.trees.slice()
      const dfs = (item) => {
        if (checkedList.length > 0) {
          const index = checkedList.indexOf(item.id)
          if (index > -1) {
            item.checked = true
            checkedList.splice(index, 1)
          }
          item.children.forEach((child) => {
            dfs(child)
          })
        }
      }
      ret.forEach((item) => {
        dfs(item)
      })
      return ret
    },
    addOrEditRole() {
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          let menus = JSON.stringify(this.getCheckedTree(this.$refs.tree.getCheckedKeys()))
          menus = menus.replace(/\"label\"/g, '"title"')
          this.roleForm.menus = JSON.parse(menus)
          if (this.editIndex === -1) {
            addRole(this.roleForm).then((res) => {
              this.tableData.unshift(res.data)
              if (this.tableData.length > this.limit) {
                this.tableData.pop()
              }
              this.total += 1
              this.$message.success('添加成功')
            })
          } else {
            editRole(this.roleForm).then((res) => {
              Object.assign(this.tableData[this.editIndex], res.data)
              this.$message.success('修改成功')
            })
          }
          this.cancel('roleForm')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .role-manage-page {
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
