<template>
<a-spin :spinning="spinning">
  <div id="app">
      <div class="search">
        <a-input-group compact>
          <a-select default-value="1" @change="topSelectChange" style="width: 80px">
            <a-select-option value="1">姓名</a-select-option>
            <a-select-option value="2">手机号</a-select-option>
          </a-select>
          <a-input-search placeholder="请输入搜索内容" style="width: 200px" @search="onSearch" />
        </a-input-group>
      </div>
      <div class="table">
          <a-table 
            :columns="columns" 
            :data-source="tableData || []"
            :row-selection="rowSelection" 
            :rowKey='record=>record.userId' 
            :pagination="false"
             bordered
            :scroll="{
            x: windowWidth,
            y: windowHeight,
          }"
          >
            <span slot="index" slot-scope="text, record, index">{{index + 1}}</span>               
            <span slot="action" slot-scope="text, record">
              <a @click="recovery(record)">恢复</a>
              <a @click="again(record)">重新添加</a>
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
      <div class="footer">
        <div>
          <a-button style="margin-left: 12px" @click="allOperation(1)" >返回</a-button>
          <a-button style="margin-left: 12px" @click="allOperation(2)" >恢复</a-button>
          <a-button style="margin-left: 12px" @click="allOperation(3)" >重新添加</a-button>
        </div>
      </div>
  </div>
</a-spin> 
</template>

<script>  
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import Pagenation from "./Pagenation/index.vue";

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    width: 100,
    scopedSlots: { customRender: 'index' },
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    width: 150,
  },
  {
    title: '学工号',
    dataIndex: 'cxUid',
    key: 'cxUid',
    align: 'center',
    width: 150,
  },
  {
    title: '操作人',
    key: 'operator',
    align: 'center',
    width: 150,
    dataIndex: 'operator',
  },
  {
    title: '移出时间',
    key: 'removeDate',
    align: 'center',
    width: 150,
    dataIndex: 'removeDate',
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    align: 'center',
    width: 160,
    scopedSlots: { customRender: 'action' },
  },
];

export default {
  data() {
    return {
      searchParams:{ 
        searchContent:'',// 查询内容
        pageNum: 1,
        pageSize: 20,
        searchField:'1',//1姓名 2手机号
      },
      moment,
      columns,
      locale,
      visible: false,
      tableData: [],
      totalNum: null,
      ids: [], //删除id
      windowWidth: window.innerWidth, //实时屏幕宽度
      windowHeight: window.innerHeight - 375, //实时屏幕高度
      spinning: false,
    };
  },
  created: function(){
    this.getTableData();
  },
  props:['type'],
  components: {
    Pagenation,
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys) => {
          this.ids = selectedRowKeys;
        },
        selectedRowKeys: this.ids,
      };
    },
  },
  methods: {
    //获取cookie
    getCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
        if(arr != null) return unescape(arr[2]); 
        return false;
    },
    getTableData() {
        this.spinning = true;
        this.$api.getRemoveList({...this.searchParams}).then((res)=>{
        if(res.success) {
          this.tableData = res.data.result;
          this.totalNum = res.data.totalNum;  
        } else {
           this.$message.error(res.message);
        }
         this.spinning = false;
      });
    },
    allOperation(val) {
      if(val === 1) {
        window.location.href="javascript:history.go(-1)"
      } else if(val === 2) {
        this.resume()
      } else if(val === 3) {
        this.reAdd();
      }
    },
    recovery(row) {
      this.ids = [row.userId];
      this.resume();
    },

    again(row) {
      this.ids = [row.userId];
      this.reAdd();
    },

    resume() {
        if(this.ids.length == 0) {
          this.$message.info("请选择数据");
        } else {
          this.spinning = true;
          this.$api.resume({ids: this.ids}).then((res)=>{
          if(res.success) {
            this.$message.success(`共恢复${res.data.totalSize}条，成功${res.data.successSize}条，失败${res.data.failSize}条`);
            this.getTableData();
          } else {
            this.$message.error(res.message);
            }
          this.spinning = false;
          this.ids = []
        });
      }
    },

    reAdd() {
      if(this.ids.length == 0) {
          this.$message.info("请选择数据");
        } else {
          this.spinning = true;
          this.$api.reAdd({ids: this.ids}).then((res)=>{
          if(res.success) {
            this.$message.success(`共添加${res.data.totalSize}条，成功${res.data.successSize}条，失败${res.data.failSize}条`);
            this.getTableData();
          } else {
            this.$message.error(res.message);
            }
          this.spinning = false;
          this.ids = []
        });
      }
    },

    topSelectChange(val) {
      this.searchParams.searchField = val; //搜索类型
    },
    onSearch(val) {
      this.searchParams.searchContent = val; //搜索
      this.getTableData();
    },
         //表格分页
    changeTable(pageNum, pageSize) {
      this.searchParams.pageNum = pageNum;
      this.searchParams.pageSize = pageSize;
      this.getTableData();
    },
  },
};
</script>

<style scoped>
 #app{
   padding: 20px;
 }
 .search{
   display: flex;
 }
/deep/.ant-input-affix-wrapper .ant-input-suffix :not(.anticon) {
  line-height: 1.5;
  color: #1890ff;
}
 .filter{
   display: inline-block;
   vertical-align: text-top;
   margin-left: 8px;
   width: 87px;
   height: 32px;
   line-height: 32px; 
   cursor: pointer;
}
.filter:hover{
  background-color: #D8E5F0;
}
.select{
  width: 100%;
  display: flex;
  margin-top: 20px;
  background-color: #F9FBFD;
  height: 40px;
  line-height: 40px;
}
.selectType{
  width: 25%;
}
.table{
  overflow: auto;
  margin-top: 10px;
  padding-bottom: 50px;
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
.isAll{
  margin-left: 10px;
  cursor: pointer;
}
#isAll /deep/ .ant-select-selection--single {
  height: 28px;
  border: none;
}

</style>
