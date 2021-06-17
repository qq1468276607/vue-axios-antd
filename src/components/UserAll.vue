<template>
<a-spin :spinning="spinning">
  <div id="app">
      <div class="search">
        <a-input-group compact>
          <a-select default-value="1" @change="topSelectChange" style="width: 80px">
            <a-select-option value="1">账号</a-select-option>
            <a-select-option value="2">证号</a-select-option>
            <a-select-option value="3">姓名</a-select-option>
            <a-select-option value="4">手机号</a-select-option>
          </a-select>
          <a-input-search placeholder="请输入搜索内容" style="width: 200px" @search="onSearch" />
        </a-input-group>
        <a-dropdown>
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item key="4">修改院系</a-menu-item>
            <a-menu-item key="10">修改专业</a-menu-item>
            <a-menu-item key="6">修改班级</a-menu-item>
          </a-menu>
          <a-button style="margin-right: 8px">属性规范化</a-button>
        </a-dropdown>
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="addUser('0')">单条录入</a-menu-item>
            <a-menu-item key="2" @click="importAll()">批量导入</a-menu-item>
          </a-menu>
          <a-button style="margin-right: 8px">新增用户</a-button>
        </a-dropdown>
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
            <span slot="cxuStatus" slot-scope="text, record, index">
              <span v-if="text=='0'"><a-badge status="error" />未激活</span>
              <span v-else><a-badge status="success" />激活</span>
            </span> 
            <span slot="recordTypeCode" slot-scope="text, record, index">
              <span v-if="text==='2'">读者</span>
              <span v-else>工作人员</span>
            </span>                      
            <span slot="action" slot-scope="text, record">
              <a @click="addUser('1',record)">编辑</a>
              <a v-if="record.cxuStatus == 0 && record.cxuId" @click="activateDeactivate('1',[record.userId])">解冻</a><a v-else style="color: #DEDEDE">解冻</a>
              <a v-if="record.cxuStatus == 1 && record.cxuId" @click="activateDeactivate('0',[record.userId])">冻结</a><a v-else style="color: #DEDEDE">冻结</a>
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
      <div class="goRemovList"><a @click="()=> this.$router.push({path: '/removeList'})">查看移除记录</a></div>
      <div class="footer">
        <div>
          <a-button style="margin-left: 12px" @click="allOperation(1)" >导出</a-button>
          <a-button style="margin-left: 12px" @click="allOperation(2)" >激活</a-button>
          <a-button style="margin-left: 12px" @click="allOperation(3)" >停用</a-button>
          <a-button style="margin-left: 12px" @click="allOperation(4)" >注册</a-button>
          <a-button style="margin-left: 12px" @click="allOperation(5)" >移除本单位</a-button>
        </div>
      </div>
      <a-modal
        title="属性规范化"
        :visible="visible"
        @ok="handleSearch"
        @cancel="()=> { this.visible = false, this.UserAttrListData={} }"
        ok-text="确认" 
        cancel-text="取消"
        destroyOnClose 
        :width='800'
      >
      <div class="model">
        <a-table 
          :columns="columns3" 
          :data-source="UserAttrListData.userAttrList || []"
          :pagination="false"
          :rowKey='null' 
          width="800px"
          bordered
        >
         <span slot="inpt" slot-scope="text, record, index">
           <a-select
              placeholder="请选择"
              style="width: 200px"      
              @change="(value)=> handleChange(value, record, index)"
            >             
              <a-select-option :value="item.userAttrId" v-for="(item, i) in DataList" :key="i">
                {{item.userAttrName}}
              </a-select-option>
            </a-select>
            <!-- <a-input placeholder="请输入" @change="(e)=> changeModelInput(record, index,e)" /> -->
         </span> 
        </a-table>
        <Pagenation
          :page="modelPage"
          :pageSize="50"
          :selectOption="[50]"
          :totle="UserAttrListData.totalNum"
          @changeTable="changeModelTable"
         />
      </div>
    </a-modal>
     <a-modal
        title="正在导出"
        :visible="exportModel"
        :footer="null"
         destroyOnClose 
      >
      <p><a-icon type="loading" /></p>
    </a-modal>
     <a-modal
        title="注册结果"
        :visible="registerVisb"
        :footer="null"
        destroyOnClose 
        @cancel="()=>this.registerVisb = false"
      >
      <p>共注册{{registerData.totalCount}}条用户，成功{{registerData.successCount}}条，失败{{registerData.failCount}}条，<span v-show="registerData.failCount > 0"><a :href="registerData.downLoadUrl">点此下载</a>错误日志</span></p>
    </a-modal>
    <a-modal
        title="移除结果"
        :visible="removeDataVisb"
        :footer="null"
        destroyOnClose 
        @cancel="()=>this.removeDataVisb = false"
        
      >
      <p>共移除{{removeData.totalCount}}条用户，成功{{removeData.successCount}}条，失败{{removeData.failCount}}条，<span v-show="removeData.failCount > 0"><a :href="removeData.downLoadUrl">点此下载</a>错误日志</span></p>
    </a-modal>
  </div>
</a-spin> 
</template>

<script>  
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import Pagenation from "./Pagenation/index.vue";
const columns3 = [
  {
    title: '原数据',
    dataIndex: 'oldAttrName',
    key: 'oldAttrName',
    align: 'center',
  },
  {
    title: '记录数',
    dataIndex: 'num',
    key: 'num',
    align: 'center',
  },
  {
    title: '变更为',
    dataIndex: 'inpt',
    key: 'inpt',
    align: 'center',
    scopedSlots: { customRender: 'inpt' },
  },
]
const columns2 = [
   {
    title: '',
    dataIndex: 'check',
    key: 'check',
    align: 'center',
    width: 50,
    scopedSlots: { customRender: 'check' },
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '账号',
    dataIndex: 'alias',
    key: 'alias',
    align: 'center',
  },
  {
    title: '证号',
    dataIndex: 'barcode',
    key: 'barcode',
    align: 'center',
  },
]
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    width: 100,
    fixed: "left",
    scopedSlots: { customRender: 'index' },
  },
  {
    title: '用户状态',
    dataIndex: 'cxuStatus',
    key: 'cxuStatus',
    align: 'center',
    width: 150,
    scopedSlots: { customRender: 'cxuStatus' }, //0未激活 1激活
  },
  {
    title: '用户ID',
    dataIndex: 'cxuId',
    key: 'cxuId',
    align: 'center',
    width: 150,
  },
  {
    title: '用户记录类型',
    dataIndex: 'recordTypeCode',
    key: 'recordTypeCode',
    align: 'center',
    width: 150,
    scopedSlots: { customRender: 'recordTypeCode' }, //1读者 2工作人员
  },
  {
    title: '用户类型',
    key: 'userGroupName',
    align: 'center',
    width: 150,
    dataIndex: 'userGroupName',
  },
  {
    title: '姓名',
    key: 'name',
    align: 'center',
    width: 150,
    dataIndex: 'name',
  },
  {
    title: '账号',
    key: 'primaryId',
    align: 'center',
    dataIndex: 'primaryId',
    width: 150,
  },
  {
    title: '证号',
    key: 'barCode',
    align: 'center',
    dataIndex: 'barCode',
    width: 150,
  },
  {
    title: '手机号',
    key: 'phone',
    align: 'center',
    dataIndex: 'phone',
    width: 150,
  },
  {
    title: '注册日期',
    key: 'regDate',
    align: 'center',
    dataIndex: 'regDate',
    width: 150,
  },
  {
    title: '失效日期',
    key: 'expirationDate',
    align: 'center',
    dataIndex: 'expirationDate',
    width: 150,
  },
    {
    title: '院系',
    key: 'collegeDept',
    align: 'center',
    dataIndex: 'collegeDept',
    width: 150,
  },
      {
    title: '专业',
    key: 'majorName',
    align: 'center',
    dataIndex: 'majorName',
    width: 150,
  },
      {
    title: '班级',
    key: 'collegeClass',
    align: 'center',
    dataIndex: 'collegeClass',
    width: 150,
  },
  {
    title: '邮箱',
    key: 'email',
    align: 'center',
    dataIndex: 'email',
    width: 150,
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    align: 'center',
    width: 160,
    fixed: "right",
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
        searchField:'1',//1账号，2证号，3姓名
        isUidExist: null,
        recordTypeCode: this.type, // 1工作人员 2读者 null为全部
        fid: this.getCookie("fid") ? this.getCookie("fid") : '' ,  
      },

      userAttrType: null,
      UserAttrListData: [],
      modelPage: 1,
      normUserAttr: {},

      registerVisb: false,  // 注册弹框
      exportModel: false,  // 导出弹框
      moment,
      columns,
      columns2,
      columns3,
      locale,
      visible: false,
      tableData: [],
      totalNum: null,
      ids: [], //删除id

      combineData: [],
      aimId: null,


      DataList: [],
      windowWidth: window.innerWidth, //实时屏幕宽度
      windowHeight: window.innerHeight - 375, //实时屏幕高度
      userAttrName: {

      },

      spinning: false,
      registerData: {},
      removeDataVisb: false,
      removeData: {},
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
    importAll() {
      this.$router.push({path: '/importAll'})
    },
     //获取表格数据
    getTableData(){
        this.spinning = true;
        this.$api.getList({...this.searchParams}).then((res)=>{
        const result = res
        if(result.success) {
          this.tableData = result.data.result;
          this.totalNum = result.data.totalNum;  
        } else {
           this.$message.error(result.message);
        }
         this.spinning = false;
      });
    },
     //表格分页
  changeTable(pageNum, pageSize) {
      this.searchParams.pageNum = pageNum;
      this.searchParams.pageSize = pageSize;
      this.getTableData();
  },
  //表格激活or停用
  activateDeactivate(val,ids) {
    const params ={
      ids,
      flag: val,
      fid: this.searchParams.fid,
    }
    this.spinning = true;
    this.$api.activateDeactivate(params).then((res)=>{
        const result = res
        if(result.success) {
          this.$message.success(result.message);
          this.getTableData();
        } else {
        this.$message.error(result.message);
        }
        this.ids = []
        this.spinning = false;
      });
    },

// 右上角属性规范化获取列表
  handleMenuClick(val) {
      this.visible =true;
      this.userAttrType = val.key;
      const params = {
          fid: this.searchParams.fid,
          userAttrType: val.key,
          page: this.modelPage,   // 属性规范化弹框分页
          rows: 50,
      }
      this.getSelectDataList();
      this.$api.getNotNormUserAttrList({...params}).then((res)=>{
      const result = res
      if(result.success) {
         this.UserAttrListData = result.data;
      } else {
      this.$message.error(result.message);
      }
    });
    },
// 右上角属性规范化分页
    changeModelTable(page, rows) {
        this.modelPage = page;
        const params = {
          fid: this.searchParams.fid,
          userAttrType: this.userAttrType,
          page: this.modelPage,   // 属性规范化弹框分页
          rows: 50,
      }
      this.$api.getNotNormUserAttrList({...params}).then((res)=>{

        const result = res
        if(result.success) {
          this.UserAttrListData = result.data;
        } else {
        this.$message.error(result.message);
      }
       this.spinning = false;
    });
    },
    // 属性规范化弹框下拉
    getSelectDataList() {   // 4 修改院系  10  修改专业  6  修改班级
      this.$api.getUserAttrList().then((res)=>{
        const result = res;
        if(result.success) {
          if (this.userAttrType === '4') {
            this.DataList = result.data.filter(item => item.userAttrType === '4')
          } else if (this.userAttrType === '10') {
            this.DataList = result.data.filter(item => item.userAttrType === '10')
          } else if (this.userAttrType === '6') {
            this.DataList = result.data.filter(item => item.userAttrType === '6')
          }
        }
      })
    },
   // 属性规范化弹框下拉改变事件
  handleChange(value, record, index){
    const userAttr = this.DataList.filter(item => item.userAttrId == value)
    this.normUserAttr[index] = {oldAttrName: record.oldAttrName ? record.oldAttrName : null , userAttrId: value, userAttrName: userAttr[0].userAttrName}
  },
 // 属性规范化弹框确定按钮
  handleSearch() {
    let array = []
    Object.values(this.normUserAttr).forEach(item=>{
      array.push(item)
    })
    const params ={
      userAttrType: this.userAttrType,
      fid: this.searchParams.fid,
      normUserAttr: array,
    }
    this.$api.updateNormUserAttr({...params}).then((res)=>{
      this.spinning = true;
      const result = res
      if(result.success) {
        this.$message.success(result.message);
        this.visible = false
        this.normUserAttr = {}
      } else {
        this.$message.error(result.message);
      }
      this.spinning = false;
      this.UserAttrListData={}
    });
    },


  allOperation(val) {
    switch(val) {
    case 1:
      this.mentExport();
        break;
    case 2:
      this.Allactivate("1")
        break;
    case 3:
      this.Allactivate("0")
        break;
    case 4:
      this.register()
        break; 
    case 5:
      this.removeUnit()
        break;   
    }
      //导出 激活 停用 注册 移除本单位
    },
    
  Allactivate(flag) {
    if (this.ids.length == 0) {
      this.$message.info("请选择数据");
    } else {
      this.activateDeactivate(flag, this.ids)
    }
  },
  register() {
    if(this.ids.length > 0) {
        this.spinning = true;
        this.$api.register({ids: this.ids}).then((res)=>{
        const result = res
        if(result.success) {
          this.registerVisb = true;
          this.registerData = result.data;
        } else {
          this.$message.error(result.message);
        }
        this.getTableData();
        this.spinning = false;
        this.ids = []
      });
    } else {
      this.$message.info("请选择数据");
    }

  },
  mentExport() {
      this.spinning = true;
      this.$api.userExport({...this.searchParams, ids: this.ids}).then((res)=>{ 
      const result = res
      if(result.success) {
        this.getMentExport();
      } else {
        this.$message.error(result.message);
      }
      this.spinning = false;
      this.ids = [];
    });
  },

  getMentExport() {
    this.exportModel = true;
    this.Time = setInterval(()=>{
      this.$api.getUserExport().then((res)=>{
        const result = res
        if(result.data.success == 2 ) {
          clearInterval(this.Time)
          this.exportModel = false;
          window.location.href = result.data.downLoadUrl
        } else if(result.data.success == 1) {
          this.$message.error(result.message);
          this.exportModel = false;
          clearInterval(this.Time)
        } else {
        }
      });
    },2000)
  },





  topSelectChange(val) {
      this.searchParams.searchField = val; //搜索类型
    },
  changeStatus(val) {// //用户状态 0未激活 1已激活
    if(val == 'null') {
      this.searchParams.status = null;
    } else {
      this.searchParams.status = val;
    }
    },
  changeUserGroups(val) {//用户类型
    if(val == 'null') {
      this.searchParams.userGroups = null;
    } else {
      this.searchParams.userGroups = [val];
    }
    },
  changeRegDate(val) {//注册日期
     if( val.length == 0) {
      this.searchParams.regDateStart = null;
      this.searchParams.regDateEnd = null;
     } else {
      this.searchParams.regDateStart = moment(val[0]).format('YYYY-MM-DD');
      this.searchParams.regDateEnd = moment(val[1]).format('YYYY-MM-DD');
     }

    },
  changeExpirationDate(val) {    //失效日期
    if( val.length == 0) {
      this.searchParams.expirationDateStart = null;
      this.searchParams.expirationDateEnd = null;
    } else{
      this.searchParams.expirationDateStart = moment(val[0]).format('YYYY-MM-DD');
      this.searchParams.expirationDateEnd = moment(val[1]).format('YYYY-MM-DD');
    }
  },
  onSearch(val) {
      this.searchParams.searchContent = val; //搜索
      this.getTableData()
    },


  addUser(addType,record) {  // 0新增用户 1修改用户
      this.addType = addType
    if (addType === '0') {
      this.record = {}
      this.$router.push({path: '/addReader', query:{ record: this.record, formType: 'add', type: this.type }})
    } else {
      this.record = record
      this.$router.push({path: '/addReader', query:{ record: this.record, formType: 'updata', type: this.type }})
    }

    },

  importData() {
      this.$router.push({path: '/importAll'})
    },


    beforeCombineUsers() {
      if(this.ids.length < 2) {
         this.$message.info("请选择至少两条数据进行合并");
      } else {
        this.combineModel = true,
        this.$api.beforeCombineUsers({ids: this.ids}).then((res)=>{
            const result = res
            if(result.success) {
             this.combineData = result.data;
            } else {
            this.$message.error(result.message);
            }
          });
      }

    },
    removeUnit() {
      if(this.ids.length == 0) {
         this.$message.info("请选择数据");
      } else {
        this.spinning = true;
        this.$api.removeUnit({ids: this.ids}).then((res)=>{
            const result = res
            if(result.success) {
              this.removeData = result.data;
              this.removeDataVisb = true;
              this.getTableData();
            } else {
              this.$message.error(result.message);
            }
            this.spinning = false;
            this.ids = [];
          });
      }
    },
    onChangeCheck(e,id) {
      if(e) {
       this.aimId = id
      } else {
       this.aimId = null
      }
    },
    toCombine() {
     this.spinning = true;
     this.$api.toCombine({ids: this.ids,aimId: this.aimId}).then((res)=>{
        const result = res
        if(result.success) {
           this.combineModel = false
           this.$message.success(result.message);
           this.getTableData();
        } else {
           this.$message.error(result.message);
        }
        this.spinning = false;
        this.ids = []
      });
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
.goRemovList{
  position: fixed;
  bottom: 45px;
  right: 23px;
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
.model{
  height: 400px;
  overflow: auto;
}
</style>
