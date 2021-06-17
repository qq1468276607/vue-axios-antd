<template>
  <a-spin :spinning="spinning">
    <div id="app">  
      <div class="search">
        <a-input-search placeholder="请输入搜索内容" style="width: 200px" @search="onSearch" />
         <a-button @click="opt('0')">新增权限</a-button>
      </div>
      <div class="table">
          <a-table 
            :columns="columns" 
            :data-source="tableData || []"
            :pagination="false"
            :rowKey='record=>record.roleId' 
             bordered
            :scroll="{
            x: windowWidth,
            y: windowHeight,
          }"
          > 
            <span slot="index" slot-scope="text, record, index">{{index + 1}}</span>                   
            <span slot="action" slot-scope="text, record">
              <a @click="opt('1',record)">编辑</a>
              <a @click="opt('2',record)">复制</a>
              <a @click="opt('3',record)">删除</a>
            </span>
          </a-table>
          <Pagenation
            :page="searchParams.pageNum"
            :pageSize="searchParams.pageSize"
            :selectOption="[10, 20, 50, 100]"
            :totle="totalNum"
            @changeTable="changeTable"
          />
      </div>
    </div>
  </a-spin> 
</template>

<script>

import Pagenation from "./Pagenation/index.vue";
import moment from "moment";

const columns = [
  {
    title: "序号",
    width: 40,
    align: "center",
    dataIndex: "index",
    key: "index",
    scopedSlots: { customRender: "index" },
  },
  {
    title: "权限代码",
    dataIndex: "roleId",
    key: "roleId",
    width: 80,
  },
  {
    title: "权限名称",
    dataIndex: "roleName",
    key: "roleName",
    width: 80,
  },
  {
    title: "权限说明",
    dataIndex: "remark",
    key: "remark",
    width: 80,
  },
  {
    title: "所属图书馆",
    dataIndex: "libName",
    key: "libName",
    width: 80,
  },
  {
    title: "操作",
    key: "action",
    width: 80,
    dataIndex: "action",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  data() {
    return {
      searchParams: {
        // fid: this.getCookie("fid") ? this.getCookie("fid") : '' ,  
        pageNum: 1,
        pageSize: 10,
        searchValue: '',
      },
      columns,
      tableData: [],
      totalNum: null,
      windowWidth: window.innerWidth, //实时屏幕宽度
      windowHeight: window.innerHeight - 220, //实时屏幕高度
      spinning: false,
    };
  },

  created() {
     this.getTableData();
  },
  components: { Pagenation },
  methods: {
   //获取cookie
    getCookie(name){
        var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
        if(arr != null) return unescape(arr[2]); 
        return false;
    },

    getTableData() {
      this.spinning = true;
      this.$api.getRoleList(this.searchParams).then((res)=>{
        const result = res;
        if(result.success) {
          this.tableData = result.data.result;
          this.totalNum = result.data.totalNum;  
        } else {
          this.$message.error(result.message);
        }
         this.spinning = false;
      });
    },

    onSearch(val) {
      this.searchParams.searchValue = val; //搜索
      this.getTableData();
    },

    changeTable(pageNum, pageSize) {
      this.searchParams.pageNum = pageNum;
      this.searchParams.pageSize = pageSize;
      this.getTableData();
    },

    opt(val, record) {
      if(val === '0') {
        this.add();
      } else if(val === '1') {
        this.edit(record);
      } else if (val === '2') {
        this.copy(record)
      } else if (val === '3') {
        this.det(record)
      }
      // 新增 编辑 复制 删除
    },
    add() {
      this.$router.push({path: '/editUser', query:{ formType: 'add' }})
    },
    edit(record) {
      this.$router.push({path: '/editUser', query:{ record, formType: 'updata' }})
    },
    copy(record) {
      this.spinning = true;
      this.$api.copyRole({ roleId: record.roleId }).then((res)=>{
        const result = res;
        if(result.success) {
          this.$message.success(result.message);
          this.getTableData(); 
        } else {
          this.$message.error(result.message);
        }
         this.spinning = false;
      });
    },
    det(record) {
      this.spinning = true;
      this.$api.detRole({ roleId: record.roleId }).then((res)=>{
        const result = res;
        if(result.success) {
          this.$message.success(result.message);
          this.getTableData(); 
        } else {
          this.$message.error(result.message);
        }
         this.spinning = false;
      });
    }
  },
}
</script>

<style scoped>
#app {
  padding: 20px;
}
 .search{
   display: flex;
   justify-content: space-between;
 }
 .table{
   margin-top: 20px;
 }
 .footer{
  z-index: 999;
  background-color: #fff;
  padding: 0 20px;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  left: 0;
  box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.13);
}


</style>
