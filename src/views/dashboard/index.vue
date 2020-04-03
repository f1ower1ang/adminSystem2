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
    <section-title title="最近分析" more @go-to="goTo('/emailTrace/record')" />
    <div class="dashboard-page__content">
      <el-table :data="tableData" class="common-table" stripe>
        <el-table-column
          v-for="(label, index) in headers"
          :key="index"
          :label="label"
          :prop="keys[index]"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column label="分析结果" align="center">
          <template slot-scope="{ row }">
            <p v-for="(rule, index) in row.rules" :key="index" style="line-height: 35px">
              {{ rule.attr }}:{{ rule.aptName }}
              <el-button size="mini" type="primary" plain style="padding: 5px 10px; margin-left: 5px;" @click="viewRule(rule)">查看</el-button>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="添加源数据" align="center" width="90">
          <template slot-scope="{ row }">
            <p :class="!row.addRule ? 'color-red': 'color-green'">{{ row.addRule | toWords }}</p>
          </template>
        </el-table-column>
        <el-table-column label="分析日期" align="center" width="200" prop="date" />
      </el-table>
    </div>
    <el-dialog :visible.sync="dialogTableVisible" :fullscreen="fullscreen" top="250px">
      <div slot="title" style="display: flex; justify-content: space-between; height: 16px; align-items: center">
        <p>查看依据</p>
        <el-button icon="el-icon-full-screen" type="text" style="margin-right: 20px; color: #909399" @click="fullscreen = !fullscreen" />
      </div>
      <el-table :data="curData" border>
        <el-table-column v-for="(header, index) in dialogHeaders" :key="index" :label="header" :prop="dialogKeys[index]" align="center" :width="widths[index]" show-overflow-tooltip />
      </el-table>
      <div slot="footer">
        <el-button size="small" @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="dialogTableVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getStatistic } from '../../api/dashboard'
import { checkRule, getRecordList } from '../../api/emailTrace'

export default {
  filters: {
    toWords(flag) {
      return flag ? '是' : '否'
    }
  },
  data() {
    return {
      tableData: null,
      headers: ['文件名', '分析类型'],
      keys: ['emailId', 'type'],
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
        }],
      dialogTableVisible: false,
      fullscreen: false,
      curData: null,
      dialogHeaders: ['规则属性', '规则类型', '匹配源数据', '所属组织', '关联邮件'],
      dialogKeys: ['attr', 'type', 'value', 'aptName', 'emailId'],
      widths: ['100', '100', '', '100', '']
    }
  },
  created() {
    getStatistic().then(res => {
      const data = [res.data.sourceCount, res.data.ruleCount, res.data.aptCount, res.data.traceCount]
      for (let i = 0; i < 4; i++) {
        this.headerData[i].data = data[i]
      }
    })
    getRecordList({ limit: 10, page: 1 }).then((res) => {
      this.tableData = res.data
    })
  },
  methods: {
    viewRule(rule) {
      checkRule(rule.id).then((res) => {
        this.curData = [res.data]
        this.dialogTableVisible = true
      })
    },
    goTo(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-page {
  background-color: $bg-page;
  min-height: calc(100vh - 55px);
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
