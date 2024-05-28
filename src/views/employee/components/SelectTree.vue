<script>
import { getDepartment } from '@/api/department'
import { listToTree } from '@/utils'

export default {
  name: 'SelectTree',
  props: {
    value: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      treeData: [],
      props: {
        label: 'name',
        value: 'id'
      }
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      this.treeData = listToTree(await getDepartment(), 0)
    },
    handleChange(list) {
      if (list.length) {
        this.$emit('input', list[list.length - 1])
      } else {
        this.$emit('input', null)
      }
    }
  }
}
</script>

<template>

  <el-cascader
    size="mini"
    :options="treeData"
    :props="props"
    separator="-"
    :value="value"
    @change="handleChange"
  />

</template>

<style scoped lang="scss">

</style>
