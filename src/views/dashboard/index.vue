<template>
  <div class="dashboard-page app-container">
    <section-title more title="数据速览" />
    <el-row class="dashboard-page__header" :gutter="20">
      <el-col v-for="(item, index) in headerData" :key="index" :span="6">
        <el-card>
          <div class="wrapper">
            <div :style="{backgroundImage: `url(${item.bg})`}" class="bg" />
            <div class="item">
              <p>{{ item.title }}</p>
              <p>{{ item.data }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <section-title title="最近分析" more />
    <el-card class="dashboard-page__content">
      <el-table :data="tableData" class="common-table" stripe>
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
      headerData: [
        {
          bg: require('../../assets/slices/source-data.png'),
          title: '源数据',
          data: 0
        }, {
          bg: require('../../assets/slices/analyse-rule.png'),
          title: '分析规则',
          data: 0
        }, {
          bg: require('../../assets/slices/group.png'),
          title: '组织',
          data: 0
        }, {
          bg: require('../../assets/slices/analyse-record.png'),
          title: '分析记录',
          data: 0
        }]
    }
  },
  created() {
    systemState().then(res => {
      this.tableData = res.data.dataList
      const data = [res.data.dataSource, res.data.rule, res.data.organise, res.data.traceSourceRecord]
      for (let i = 0; i < 4; i++) {
        this.headerData[i].data = data[i]
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.dashboard-page {
  &__header{
    .bg {
      display: inline-block;
      width: 52px;
      height: 52px;
      vertical-align: bottom;
    }
    .item {
      height: 52px;
      display: inline-block;
      font-size: $font-size-medium-x;
      margin-left: 5px;
      p:first-child {
        margin: 10px 0 5px;
        color: $color-pl;
        font-size: $font-size-medium-s;
      }
    }
  }
  &__content {
  }
}
</style>
