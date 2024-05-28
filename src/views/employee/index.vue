<script>
import { getDepartment } from '@/api/department'
import { getEmployeeList, exportEmployee, delEmployee } from '@/api/employee'
import { listToTree } from '@/utils'
import { saveAs } from 'file-saver'
import ImportExcel from '@/views/employee/components/ImportExcel.vue'
export default {
  name: 'Employee',
  components: {
    ImportExcel
  },
  data() {
    return {
      depts: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      queryParams: {
        departmentId: null,
        page: 1,
        pagesize: 10,
        keyword: ''
      },
      list: [],
      total: 0,
      showExcelDialog: false
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      const res = await getDepartment()
      this.depts = listToTree(res, 0)
      this.queryParams.departmentId = res[0].id
      this.$nextTick(() => {
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId)
      })
      this.getEmployeeList()
    },
    selectNode(node) {
      this.queryParams.departmentId = node.id
      this.queryParams.page = 1
      this.getEmployeeList()
    },
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.queryParams)
      this.list = rows
      this.total = total
    },
    handleCurrentChange(val) {
      this.queryParams.page = val
      this.getEmployeeList()
    },
    changeValue() {
      clearTimeout(timer)
      const timer = setTimeout(() => {
        this.queryParams.page = 1
        this.getEmployeeList()
      }, 300)
    },
    async exportEmployee() {
      const res = await exportEmployee()
      saveAs(res, '员工信息表.xlsx')
    },
    handleSuccess() {
      this.getEmployeeList()
    },
    delEmployee(id) {
      this.$confirm('确定删除吗?', '提示')
        .then(async() => {
          await delEmployee(id)
          if (this.list.length === 1 && this.queryParams.page > 1) this.queryParams.page--
          this.getEmployeeList()
          this.$message.success('删除成功')
        })
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input
          v-model="queryParams.keyword"
          style="margin-bottom:10px"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="输入员工姓名全员搜索"
          @input="changeValue"
        />
        <el-tree
          ref="deptTree"
          :data="depts"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          highlight-current
          node-key="id"
          @current-change="selectNode"
        />
      </div>
      <div class="right">
        <el-row type="flex" justify="end">
          <el-button type="primary" size="mini" @click="$router.push('/employee/detail')">添加员工</el-button>
          <el-button size="mini" @click="showExcelDialog = true">excel导入</el-button>
          <el-button size="mini" @click="exportEmployee">excel导出</el-button>
        </el-row>
        <el-table :data="list">
          <el-table-column prop="staffPhoto" label="头像" align="center">
            <template v-slot="{row}">
              <el-avatar v-if="row.staffPhoto" :src="row.staffPhoto" />
              <span v-else>{{ row.username.charAt(0) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="mobile" label="手机号" sortable />
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <template v-slot="{row}">
              <span v-if="row.formOfEmployment === 1">正式</span>
              <span v-else-if="row.formOfEmployment === 2">非正式</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable />
          <el-table-column label="操作" width="230px">
            <template v-slot="{row}">
              <el-button size="mini" type="primary" @click="$router.push(`/employee/detail/${row.id}`)">查看</el-button>
              <el-button size="mini" type="success">角色</el-button>
              <el-button size="mini" type="danger" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="end" align="middle" style="height:60px">
          <el-pagination
            layout="total, prev, pager, next"
            :total="total"
            :page-size="queryParams.pagesize"
            :current-page="queryParams.page"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </div>
      <ImportExcel :show-excel-dialog.sync="showExcelDialog" @uploadSuccess="handleSuccess" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-container {
  display: flex;
  .left {
    width: 20%;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }
  .right {
    width: 80%;
    padding: 20px;
    .operate-tools {
      margin: 10px;
    }
  }
}
</style>
