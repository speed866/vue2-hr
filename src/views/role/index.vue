<script>
import { getRoleList, addNewRole, updateRole, delRole } from '@/api/role'
export default {
  name: 'Role',
  data() {
    return {
      list: [],
      pageParams: {
        page: 1,
        pagesize: 5,
        total: 0
      },
      showDialog: false,
      roleForm: {
        name: '',
        description: '',
        state: 0
      },
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows, total } = await getRoleList(this.pageParams)
      this.list = rows
      this.pageParams.total = total
      this.list.forEach(item => {
        this.$set(item, 'isEdit', false)
        this.$set(item, 'editRow', {
          name: item.name,
          state: item.state,
          description: item.description
        })
      })
    },
    handleCurrentChange(val) {
      this.pageParams.page = val
      this.getRoleList()
    },
    submit() {
      this.$refs.roleForm.validate(async valid => {
        if (valid) {
          await addNewRole(this.roleForm)
          this.getRoleList()
          this.cancel()
          this.$message.success('添加角色成功')
        }
      })
    },
    cancel() {
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    handleEdit(row) {
      row.isEdit = true
      row.editRow.name = row.name
      row.editRow.state = row.state
      row.editRow.description = row.description
    },
    async handleEditSubmit(row) {
      if (row.editRow.name && row.editRow.description) {
        await updateRole({ ...row.editRow, id: row.id })
        Object.assign(row, {
          ...row.editRow,
          isEdit: false
        })
        this.$message.success('修改成功')
      } else {
        this.$message.error('角色和描述不能为空')
      }
    },
    handleDel(row) {
      this.$confirm('确定删除该角色吗？', '提示')
        .then(async() => {
          await delRole(row.id)
          if (this.list.length === 1) this.pageParams.page--
          this.getRoleList()
          this.$message.success('删除成功')
        })
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="app-container">
      <div class="role-operator">
        <el-button type="primary" size="mini" @click="showDialog = true">添加角色</el-button>
      </div>
      <el-table :data="list">
        <el-table-column label="序号" width="60px" type="index" align="center" />
        <el-table-column label="角色" align="center" width="200" prop="name">
          <template v-slot="{row}">
            <el-input v-if="row.isEdit" v-model="row.editRow.name" size="mini" />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="启用" align="center" width="200" prop="state">
          <template v-slot="{row}">
            <el-switch v-if="row.isEdit" v-model="row.editRow.state" :active-value="1" :inactive-value="0" />
            <span v-else>{{ row.state === 1? '已启用': row.state === 0 ? '未启用' : '无' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center" prop="description">
          <template v-slot="{row}">
            <el-input v-if="row.isEdit" v-model="row.editRow.description" />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="{row}">
            <template v-if="!row.isEdit">
              <el-button type="primary" size="mini">分配权限</el-button>
              <el-button type="success" size="mini" @click="handleEdit(row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="handleDel(row)">删除</el-button>
            </template>
            <template v-else>
              <el-button type="primary" size="mini" @click="handleEditSubmit(row)">确定</el-button>
              <el-button size="mini" @click="row.isEdit = false">取消</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end" style="height: 60px" align="middle">
        <el-pagination
          layout="prev, pager, next"
          :page-size="pageParams.pagesize"
          :current-page="pageParams.page"
          :total="pageParams.total"
          @current-change="handleCurrentChange"
        />
      </el-row>
      <el-dialog :visible.sync="showDialog" title="新增角色" width="30%" @close="cancel">
        <el-form ref="roleForm" label-width="80px" :model="roleForm" :rules="rules">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" style="width:80%" />
          </el-form-item>
          <el-form-item label="启用" prop="state">
            <el-switch v-model="roleForm.state" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="roleForm.description" type="textarea" style="width:80%" />
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="submit">确定</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped lang="scss">
.role-operator {
  padding: 0 0 10px;
}

</style>
