<template>
  <div id="app">
    <a-tabs default-active-key="null" @change="callback">
      <a-tab-pane key="null" tab="全部">
        <UserAll :type='null'></UserAll>
      </a-tab-pane>
      <a-tab-pane key="2" tab="读者" >
        <UserReader :type='2'></UserReader>
      </a-tab-pane>
      <a-tab-pane key="1" tab="工作人员">
        <UserWork :type='1'></UserWork>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>  
import UserAll from '../components/UserAll'
import UserReader from '../components/UserReader'
import UserWork from '../components/UserWork'
export default {
  data() {
    return {
      num:null
    };
  },
  created: function(){
  
  },
  components: {
    UserAll,
    UserReader,
    UserWork,
  },
  methods: {
    callback(key) {
     this.num = key
    },
  },
};
</script>
<style scoped>
 #app{
   padding: 20px;
 }
 </style>

