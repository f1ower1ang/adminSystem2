<template>
  <div class="email-trace-page app-container">
    <el-radio-group v-model="radio" size="medium">
      <el-radio-button label="0">文件夹</el-radio-button>
      <el-radio-button label="1">表格</el-radio-button>
    </el-radio-group>
    <el-card class="email-trace-page__header">
      <p>选择邮件所在文件夹进行批量上传</p>
      <el-upload
        action="#"
        :on-remove="handleRemove"
        :file-list="fileList"
      >
        <el-button size="medium" type="primary">选择文件夹</el-button>
      </el-upload>
    </el-card>
    <el-card class="email-trace-page__content">
      <el-table :data="tableData">
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
      <div class="options">
        <el-button type="primary" size="medium">开始分析</el-button>
        <el-button type="primary" size="medium">添加为源数据</el-button>
      </div>
    </el-card>
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
      widths: ['', '80', '', '100', ''],
      APTS: [
        {
          label: 'APT32',
          value: 'APT32'
        }
      ]
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
  &__header {
    margin-top: 20px;
    p {
      padding-bottom: 20px;
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
