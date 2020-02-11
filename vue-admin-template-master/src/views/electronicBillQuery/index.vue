<template>
  <div class="app-container">
    <div class="filter-container" style="font-size:14px;">
      <!-- <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      开票日期范围：<el-date-picker style="width:243px;" size="small" v-model="listQuery.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
      票据号码：<el-input size="small" v-model="listQuery.billCode" placeholder="票据号码" style="width: 110px;" class="filter-item" @keyup.enter.native="handleFilter" />
      就诊人名称：<el-input size="small" v-model="listQuery.name" placeholder="就诊人名称" style="width: 99px;" class="filter-item" @keyup.enter.native="handleFilter" />
      证件号：<el-input size="small" v-model="listQuery.idCode" placeholder="证件号" style="width: 110px;" class="filter-item" @keyup.enter.native="handleFilter" />
      医疗机构名称：<el-input size="small" v-model="listQuery.organization" placeholder="医疗机构名称" style="width: 115px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button  style="margin-left:10px;vetical-align:bottom;" size="small" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top:20px;"
      @sort-change="sortChange"
    >
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开票日期" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="就诊人名称" width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="证件号" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.idCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="票据号码" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.billCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" width="95px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报销金额" align="center" width="95">
        <template slot-scope="{row}">
          <span>{{ row.reimbursementAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="医疗机构名称" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.organization }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="开票日期" prop="date">
          <el-date-picker v-model="temp.date" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="就诊人名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入就诊人名称" />
        </el-form-item>
        <el-form-item label="证件号" prop="idCode">
          <el-input v-model="temp.idCode" placeholder="请输入证件号" />
        </el-form-item>
        <el-form-item label="票据号码" prop="billCode">
          <el-input v-model="temp.billCode" placeholder="请输入票据号码" />
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input v-model="temp.amount" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="报销金额" prop="reimbursementAmount">
          <el-input v-model="temp.reimbursementAmount" placeholder="请输入报销金额" />
        </el-form-item>
        <el-form-item label="医疗机构名称" prop="organization">
          <el-input v-model="temp.organization" placeholder="请输入医疗机构名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          正确
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    },
    parseTime: parseTime
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        date: null,
        billCode: undefined,
        name: undefined,
        idCode: undefined,
        organization: undefined
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        name: 1,
        idCode: '',
        date: new Date(),
        billCode: '',
        amount: '',
        reimbursementAmount: '',
        organization: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [{ required: true, message: '请输入就诊人名称', trigger: 'change' }],
        date: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
        idCode: [{ required: true, message: '请输入证件号', trigger: 'blur' }],
        billCode: [{ required: true, message: '请输入票据号码', trigger: 'blur' }],
        amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        reimbursementAmount: [{ required: true, message: '请输入报销金额', trigger: 'blur' }],
        organization: [{ required: true, message: '请输入证件号', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: 1,
        idCode: '',
        date: new Date(),
        billCode: '',
        amount: '',
        reimbursementAmount: '',
        organization: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.date = new Date(this.temp.date)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
<style>
    .filter-container{
        font-size:14px;
    }

</style>
