<template>
  <div class="dashboard-page app-container">
    <el-card class="dashboard-page__header" :body-style="{display: 'flex', alignItems: 'center', justifyContent: 'center'}">
      <p slot="header">数据速览</p>
      <div class="item">
        <p>数据源</p>
        <p>{{ dataSource }}</p>
      </div>
      <div class="item">
        <p>规则</p>
        <p>{{ rule }}</p>
      </div>
      <div class="item">
        <p>组织</p>
        <p>{{ organise }}</p>
      </div>
      <div class="item">
        <p>溯源记录</p>
        <p>{{ traceSourceRecord }}</p>
      </div>
    </el-card>
    <el-card class="dashboard-page__content">
      <div slot="header">
        最近溯源
      </div>
      <el-table :data="tableData">
        <el-table-column
          v-for="(label, index) in headers"
          :key="index"
          :label="label"
          :prop="keys[index]"
          :width="widths[index]"
          align="center"
        />
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { systemState } from '../../api/dashboard'

export default {
  data() {
    return {
      tableData: null,
      headers: ['文件名', '发件人', '溯源结果', '添加源数据', '溯源日期'],
      widths: ['', '', '', '100', '150'],
      keys: ['fileName', 'originator', 'result', 'flag', 'date'],
      dataSource: 0,
      rule: 0,
      organise: 0,
      traceSourceRecord: 0
    }
  },
  created() {
    systemState().then(res => {
      this.tableData = res.data.dataList
      this.dataSource = res.data.dataSource
      this.rule = res.data.rule
      this.organise = res.data.organise
      this.traceSourceRecord = res.data.traceSourceRecord
    })
  }
}
</script>

<style lang="scss" scoped>
.dashboard-page {
  &__header{
    .item {
      flex: 1;
      text-align: center;
      p:first-child {
        margin-bottom: 10px;
        color: $color-pl
      }
    }
  }
  &__content {
    margin-top: 30px;
  }
}
</style>
