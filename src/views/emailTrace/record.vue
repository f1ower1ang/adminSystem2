<template>
  <div class="record-page app-container">
    <section-title title="分析记录" />
    <div class="record-page__header">
      <el-form :model="formData" :inline="true" class="common-form" label-width="75px">
        <el-row>
          <el-form-item label="发件邮箱:">
            <el-input v-model="formData.fromAdd" size="small" placeholder="请输入邮箱" type="email" />
          </el-form-item>
          <el-form-item>
            <p slot="label" style="text-align: center">发件IP:</p>
            <el-input v-model="formData.fromIp" size="small" placeholder="请输入ip" />
          </el-form-item>
          <el-form-item label="邮件标题:">
            <el-input v-model="formData.subject" size="small" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label="所属组织:">
            <el-select v-model="formData.aptName" size="small" placeholder="请选择组织">
              <template v-if="dic.APT">
                <el-option v-for="(aptName, index) in dic.APT" :key="index" :label="aptName" :value="aptName" />
              </template>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="分析日期:">
            <el-date-picker
              v-model="formData.startDate"
              style="width: 100%"
              type="date"
              size="small"
              value-format="yyyy-MM-dd"
              placeholder="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item>
            <p slot="label" style="text-align: center">至</p>
            <el-date-picker
              v-model="formData.endDate"
              style="width: 100%"
              type="date"
              size="small"
              value-format="yyyy-MM-dd"
              placeholder="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="success" size="small" @click="search">搜索</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="option">
      <el-button type="danger" size="small" @click="deleteMoreItem">删除</el-button>
    </div>
    <div class="record-page__content">
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
          <el-table-column label="文件名" prop="emailId" align="center" />
          <el-table-column label="分析结果" align="center">
            <template slot-scope="{ row }">
              <p v-for="(rule, index) in row.rules" :key="index" style="line-height: 35px">
                {{ dic.attr[rule.attr] }}:{{ rule.aptName }}
                <el-button size="mini" type="primary" plain style="padding: 5px 10px; margin-left: 5px;" @click="viewRule(rule)">查看</el-button>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="添加源数据" align="center">
            <template slot-scope="{ row }">
              <p :class="!row.addRule ? 'color-red': 'color-green'">{{ row.addRule | toWords }}</p>
            </template>
          </el-table-column>
          <el-table-column label="分析日期" prop="date" align="center" />
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row, $index }">
              <el-button type="danger" size="mini" plain @click="deleteOneItem(row, $index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </pagination>
    </div>
    <el-dialog :visible.sync="dialogTableVisible" :fullscreen="fullscreen" top="250px">
      <div slot="title" style="display: flex; justify-content: space-between; height: 16px; align-items: center">
        <p>查看依据</p>
        <el-button icon="el-icon-full-screen" type="text" style="margin-right: 20px; color: #909399" @click="fullscreen = !fullscreen" />
      </div>
      <el-table :data="curData" border @selection-change="handleSelectionChange">
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
import { checkRule, deleteRecord, deleteRecords, getRecordList } from '../../api/emailTrace'
import CommonMixin from '../common-mixin'
import { getAptList } from '../../api/ruleManage'

export default {
  name: 'Record',
  filters: {
    toWords(flag) {
      return flag ? '是' : '否'
    }
  },
  mixins: [CommonMixin],
  data() {
    return {
      formData: {
        fromAdd: '',
        fromIp: '',
        subject: '',
        aptName: '',
        startDate: '',
        endDate: ''
      },
      headers: ['文件名'],
      keys: ['emailId', 'rules', 'addRule'],
      dialogHeaders: ['规则属性', '规则类型', '匹配源数据', '所属组织', '关联邮件'],
      dialogKeys: ['attr', 'type', 'value', 'aptName', 'emailId'],
      widths: ['100', '100', '', '100', ''],
      curData: null,
      getItems: getRecordList,
      delItem: deleteRecord,
      delItems: deleteRecords
    }
  },
  async created() {
    this.loading = true
    const res = await getAptList({ limit: 9999, page: 1 })
    this.dic.APT = []
    res.data.forEach((res) => {
      this.dic.APT.push(res.name)
    })
    this.getTableData()
  },
  methods: {
    viewRule(rule) {
      checkRule(rule.id).then((res) => {
        res.data.attr = this.dic.attr[res.data.attr]
        res.data.type = this.dic.types[res.data.type]
        this.curData = [res.data]
        this.dialogTableVisible = true
      })
    }
  }
}
</script>

<style scoped lang="scss">
.record-page {
  &__content {
    margin-top: 10px;
  }
}
</style>
