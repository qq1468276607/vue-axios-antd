<template>
  <div id="app">
    <a-spin :spinning="false">
       <router-view v-if="isShow"/>
       <div v-else>加载中。。。</div>
    </a-spin>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
  return {
    isShow: false,
  };
},
  created: function(){
    this.setCookie("fid",'105551');            
    this.setCookie("_uid",'106419250');
    this.setCookie("UID",'106419250');
    this.setCookie("source",'num99');
    this.setCookie("wfwEnc",'36C954E48F56B9C77AA6CF8E0246F12B');
    this.login();
     // 线上需要获取cookie 所以先模拟线上设置cookie 
  },
  methods: {
        /*设置cookie*/
    setCookie(name,value,expires){
        var exp = new Date();
        exp.setTime(exp.getTime() + expires*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    },
        //获取cookie
    getCookie(name){
        var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
        if(arr != null) return unescape(arr[2]); 
        return false;
    },
    login() {
      this.$api.login({
        uid: this.getCookie("UID") ? this.getCookie("UID") : '' ,  
        fid: this.getCookie("fid") ? this.getCookie("fid") : "",
        source: this.getCookie("source") ? this.getCookie("source") : '' , 
        wfwEnc: this.getCookie("wfwEnc") ? this.getCookie("wfwEnc") : '' , 
      }).then(res=>{
        if(res.success) {
           console.log("res", res)
           this.setCookie("jwtAuth", res.data.jwt);
           this.setCookie("mappingPath", res.data.mappingPath);
           this.isShow = true
        }
      })
    } 
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
