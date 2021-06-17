<template>
  <div id="app">
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="院系管理">
        <DepartMent></DepartMent>
      </a-tab-pane>
      <a-tab-pane key="2" tab="专业管理" force-render>
        <Major></Major>
      </a-tab-pane>
      <a-tab-pane key="3" tab="班级管理">
        <Class></Class>
      </a-tab-pane>
      <!-- <a-tab-pane key="4" tab="用户类型管理">
        <User></User>
      </a-tab-pane> -->
    </a-tabs>
  </div>
</template>


<script>
import DepartMent from "./AttributeTabs/Department.vue";
import Major from "./AttributeTabs/Major.vue";
import Class from "./AttributeTabs/Class.vue";
import User from "./AttributeTabs/User.vue";
export default {
  name: "Attribute",
  data() {
    return {};
  },
  components: {
    DepartMent,
    Major,
    Class,
    User,
  },
  methods: {},
};
</script>

<style scoped>
#app {
  padding: 20px;
  text-align: left;
}
</style>
