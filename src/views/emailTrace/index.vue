<template>
  <div class="email-trace-page app-container">
    <section-title title="分析任务" />
    <el-radio-group v-model="radio" size="medium">
      <el-radio-button label="0">文件夹</el-radio-button>
      <el-radio-button label="1">表格</el-radio-button>
    </el-radio-group>
    <div class="email-trace-page__header">
      <p>选择邮件所在文件夹进行批量上传</p>
      <el-upload
        action="#"
        :on-remove="handleRemove"
        :file-list="fileList"
        style="display: inline-block"
      >
        <el-button size="medium" type="success" icon="el-icon-search">选择文件夹</el-button>
      </el-upload>
      <el-button size="medium" type="primary" class="btn">开始分析</el-button>
      <el-button size="medium" type="primary" plain class="btn">添加源数据</el-button>
    </div>
    <div class="email-trace-page__content">
      <el-table :data="tableData" class="common-table" :cell-style="{fontSize: '12px'}" stripe>
        <el-table-column
          type="selection"
          width="50"
          align="center"
        />
        <el-table-column v-for="(label, index) in headers" :key="index" :label="label" :prop="keys[index]" :width="widths[index]" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="APT">
          <template slot-scope="{ row }">
            <el-select v-model="row.apt">
              <el-option
                v-for="item in APTS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button type="danger" size="mini" @click="del(row)">删除</el-button>
            <el-button type="primary" size="mini" @click="add(row)">添加源</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      radio: 0,
      fileList: [],
      tableData: null,
      headers: ['文件名', '大小', '进度', '状态', '分析结果'],
      keys: ['filename', 'size', 'percentage', 'status', 'result'],
      widths: ['', '80', '', '100', '']
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
.email-trace-page {
  .el-radio-group {
    margin: 20px 0;
  }
  &__header {
    margin-top: 20px;
    p {
      padding-bottom: 20px;
    }
    .btn {
      margin-left: 5px;
    }
  }
  &__content {
    margin-top: 20px;
    .options {
      margin-top: 20px;
    }
  }
}
</style>
