<template>
  <div class="source-import-page app-container">
    <el-radio-group v-model="radio" size="medium">
      <el-radio-button label="0">文件夹</el-radio-button>
      <el-radio-button label="1">表格</el-radio-button>
    </el-radio-group>
    <el-card class="source-import-page__header">
      <p>选择邮件所在文件夹进行批量上传</p>
      <el-upload
        action="#"
        :on-remove="handleRemove"
        :file-list="fileList"
      >
        <el-button size="medium" type="primary">选择文件夹</el-button>
      </el-upload>
    </el-card>
    <el-card class="source-import-page__content">
      <el-table :data="tableData">
        <el-table-column
          type="selection"
          width="50"
          align="center"
        />
        <el-table-column v-for="(label, index) in headers" :key="index" :label="label" :prop="keys[index]" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="操作" align="center">
          <template slot-scope="{ row }">
            <el-button type="danger" size="mini" @click="del(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="options">
        <el-button type="primary" size="medium">开始导入</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'SourceImport',
  data() {
    return {
      radio: 0,
      fileList: [],
      tableData: null,
      headers: ['文件名', '大小', '进度', '状态'],
      keys: ['filename', 'size', 'percentage', 'status']
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    del() {
    },
    add() {
    }
  }
}
</script>

<style scoped lang="scss">
.source-import-page{
  &__header, &__content {
    margin-top: 20px;
  }
  &__header {
    p {
      padding-bottom: 20px;
    }
  }
  &__content {
    .options {
      margin-top: 20px;
    }
  }
}
</style>
