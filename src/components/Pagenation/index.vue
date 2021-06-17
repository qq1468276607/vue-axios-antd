<template>
  <div id="pagenation">
    <span>共{{ totle }}条记录</span>
    <a-select
      :value="pageSize"
      style="width: 100px"
      @change="handleChange"
      size="small"
    >
      <a-select-option v-for="item in selectOption" :value="item" :key="item">
        {{ item }}条/页
      </a-select-option>
    </a-select>
    <a-pagination
      :current="page"
      :pageSize="pageSize"
      :total="totle"
      @change="onChange"
      size="small"
    />
    <a-input-search
      enter-button="跳转"
      @search="onSearch"
      style="width: 90px"
      size="small"
    />
  </div>
</template>


<script>
export default {
  props: ["page", "pageSize", "selectOption", "totle"],
  data() {
    return {
      cur: 0,
    };
  },
  watch: {
    page(newVal, oldVal) {
      this.cur = newVal; //对父组件传过来的值进行监听，如果改变也对子组件内部的值进行改变
    },
  },
  methods: {
    onChange(pageNumber) {
      this.$emit("changeTable", Number(pageNumber), this.pageSize);
    },
    handleChange(value) {
      this.$emit("changeTable", 1, Number(value));
    },
    onSearch(value) {
      if(Number(value) > Math.ceil(this.totle / this.pageSize)) {
        this.$emit("changeTable", Math.ceil(this.totle / this.pageSize), this.pageSize);
      } else {
        this.$emit("changeTable", Number(value), this.pageSize);
      }

    },
  },
};
</script>

<style scoped>
#pagenation {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
#pagenation > span {
  line-height: 24px;
  margin-right: 7px;
}
</style>
