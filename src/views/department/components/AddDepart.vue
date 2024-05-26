<script>
import { getDepartment, getManagerList, addDepartment, getDepartmentDetail, updateDepartment } from '@/api/department'
export default {
  name: 'AddDepart',
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    currentNodeId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      form: {
        name: '',
        code: '',
        managerId: '',
        introduce: '',
        pid: ''
      },
      rules: {
        name: [
          { required: true, message: '输入不得为空', trigger: 'blur' },
          { min: 2, max: 10, message: '请输入2-10个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: async(rule, value, callback) => {
              let res = await getDepartment()
              if (this.form.id) {
                res = res.filter(item => item.id !== this.form.id)
              }
              if (res.some(item => item.name === value)) {
                callback(new Error('已有该部门'))
              } else {
                callback()
              }
            }
          }

        ],
        code: [
          { required: true, message: '输入不得为空', trigger: 'blur' },
          { min: 2, max: 10, message: '请输入2-10个字符', trigger: 'blue' },
          {
            trigger: 'blur',
            validator: async(rule, value, callback) => {
              let res = await getDepartment()
              if (this.form.id) {
                res = res.filter(item => item.id !== this.form.id)
              }
              if (res.some(item => item.code === value)) {
                callback(new Error('已有该编码'))
              } else {
                callback()
              }
            }
          }
        ],
        introduce: [
          { required: true, message: '输入不得为空', trigger: 'blur' },
          { min: 1, max: 100, message: '请输入1-100个字符', trigger: 'blur' }
        ],
        managerId: [
          { required: true, message: '输入不得为空', trigger: 'blur' }
        ]
      },
      managerList: []
    }
  },
  computed: {
    title() {
      return this.form.id ? '编辑部门' : '新增部门'
    }
  },
  created() {
    this.getManagerList()
  },
  methods: {
    // dialog关闭按钮回调
    close() {
      this.$emit('update:dialogFormVisible', false)
      this.$refs.addForm.resetFields()
      this.form = {
        name: '',
        code: '',
        managerId: '',
        introduce: '',
        pid: ''
      }
    },
    // 获取部门负责人列表
    async getManagerList() {
      this.managerList = await getManagerList()
    },
    // 提交表单
    submit() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          let msg = '添加'
          if (this.form.id) {
            msg = '更新'
            await updateDepartment(this.form)
          } else {
            await addDepartment({ ...this.form, pid: this.currentNodeId })
          }

          this.$emit('updateDepart')
          this.$message.success(`${msg}部门成功`)
          this.close()
        }
      })
    },
    // 获取部门详情
    async getDepartmentDetail() {
      this.form = await getDepartmentDetail(this.currentNodeId)
    }
  }
}
</script>

<template>
  <el-dialog :title="title" :visible="dialogFormVisible" width="40%" @close="close">
    <el-form ref="addForm" :rules="rules" :model="form" label-width="100px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" style="width: 80%" placeholder="2-10个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="form.code" style="width: 80%" placeholder="2-10个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="managerId">
        <el-select v-model="form.managerId" placeholder="请选择负责人">
          <el-option v-for="item in managerList" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="form.introduce" type="textarea" style="width: 80%" placeholder="1-100个字符" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
