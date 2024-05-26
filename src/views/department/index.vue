<script>
import { getDepartment, delDepartment } from '@/api/department'
import { listToTree } from '@/utils'
import AddDepart from '@/views/department/components/AddDepart.vue'

export default {
  name: 'Department',
  components: {
    AddDepart
  },
  data() {
    return {
      data: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      // 控制谈层显示与隐藏
      showDialog: false,
      currentNodeId: null
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    // 获取部门列表
    async getDepartment() {
      const res = await getDepartment()
      this.data = listToTree(res, 0)
    },
    // 添加部门回调
    handleCommand(type, id) {
      if (type === 'add') {
        this.showDialog = true
        this.currentNodeId = id
      } else if (type === 'edit') {
        this.showDialog = true
        this.currentNodeId = id
        this.$nextTick(() => {
          this.$refs.addDepart.getDepartmentDetail()
        })
      } else {
        this.$confirm('确定要删除该部门吗？', '提示')
          .then(async() => {
            await delDepartment(id)
            this.getDepartment()
            this.$message.success('删除成功')
          })
      }
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="app-container">
      <el-tree :data="data" :props="defaultProps" default-expand-all :expand-on-click-node="false">
        <template v-slot="{data}">
          <el-row style="width:100%;height:40px" type="flex" justify="space-between" align="middle">
            <el-col>{{ data.name }}</el-col>
            <el-col :span="4">
              <span class="tree-manager">{{ data.managerName }}</span>
              <span @click.stop>
                <el-dropdown trigger="click" @command="handleCommand($event, data.id)">
                  <!-- 显示区域内容 -->
                  <span class="el-dropdown-link">
                    操作<i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <!-- 下拉菜单选项 -->
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                    <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                    <el-dropdown-item command="del">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </el-col>
          </el-row>
        </template>

      </el-tree>

      <AddDepart
        ref="addDepart"
        :dialog-form-visible.sync="showDialog"
        :current-node-id="currentNodeId"
        @updateDepart="getDepartment"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-container {
  padding: 20px 140px;

  .tree-manager {
    display: inline-block;
    width: 100px;
    margin-right: 10px;
  }
}
</style>
