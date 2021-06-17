<template>
  <div id="app">
      <div class="search">
        <a-input-group compact>
          <a-select default-value="1" @change="topSelectChange">
            <a-select-option value="1">账号</a-select-option>
            <a-select-option value="2">证号</a-select-option>
            <a-select-option value="3">姓名</a-select-option>
          </a-select>
          <a-input-search placeholder="请输入搜索内容" style="width: 200px" @search="onSearch" />
          <div class="filter" v-on:click="isShowFilter">
            <img src="../assets/filter.png" /> 筛选 <a-icon type="caret-up" v-if="filterShow === true" /><a-icon type="caret-down" v-else />
          </div>
        </a-input-group>
        <a-dropdown>
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item key="1">修改用户类型</a-menu-item>
            <a-menu-item key="2">修改院系</a-menu-item>
            <a-menu-item key="3">修改专业</a-menu-item>
            <a-menu-item key="4">修改班级</a-menu-item>
          </a-menu>
          <a-button style="margin-right: 8px">属性规范化</a-button>
        </a-dropdown>
        <a-button @click="addUser('0')">
          新增用户
        </a-button>
      </div>
      <div class="select" v-show="filterShow">
          <div class="selectType">
            用户状态： 
            <a-select default-value="null" style="width: 65%" @change="changeStatus">
              <a-select-option value="null">
                全部
              </a-select-option>
              <a-select-option value="1">
                已激活
              </a-select-option>
              <a-select-option value="0">
                未激活
              </a-select-option>
            </a-select>
          </div>
          <div class="selectType">
            用户类型：
            <a-select default-value="null" style="width: 65%" @change="changeUserGroups">
               <a-select-option value="null">
                全部
              </a-select-option>
              <a-select-option :value="item.userAttrName" v-for="(item, i) in userGroupData" :key="i">
                {{item.userAttrName}}
              </a-select-option>
            </a-select>
          </div>
          <div class="selectType">
            注册日期： <a-range-picker style="width: 65%" @change="changeRegDate" :locale="locale"  />     
          </div>
          <div class="selectType">
            失效日期： <a-range-picker style="width: 65%" @change="changeExpirationDate" :locale="locale" />     
          </div>
      </div>
      <div class="table">
          <a-table 
            :columns="columns" 
            :data-source="tableData || []"
            :row-selection="rowSelection" 
            :rowKey='record=>record.id' 
            :pagination="false"
             bordered
          >
            <span slot="index" slot-scope="text, record, index">{{index + 1}}</span> 
            <span slot="status" slot-scope="text, record, index">
              <span v-if="text=='0'"><a-badge status="error" />未激活</span>
              <span v-else><a-badge status="success" />激活</span>
            </span> 
            <span slot="type" slot-scope="text, record, index">
              <span v-if="text==='1'">读者</span>
              <span v-else>工作人员</span>
            </span> 
                     
            <span slot="action" slot-scope="text, record">
              <a @click="addUser('1',record)">编辑</a>
              <a v-if="record.status == 0 " @click="activateDeactivate('1',[record.id])">激活</a><a v-else style="color: #DEDEDE">激活</a>
              <a v-if="record.status == 1 " @click="activateDeactivate('0',[record.id])">停用</a><a v-else style="color: #DEDEDE">停用</a>
            </span>
          </a-table>
          <Pagenation
            :page="searchParams.page"
            :pageSize="searchParams.rows"
            :selectOption="[10, 20, 50, 100]"
            :totle="totalNum"
            @changeTable="changeTable"
          />
      </div>
      <div class="footer">
        <div>
            <!-- <a-checkbox :default-checked="false" />
            <a-dropdown placement="topCenter">
              <span class="isAll" v-if="isAll == '1'">全选所有页</span>
              <span class="isAll" v-else>全选当前页</span>
              <a-menu slot="overlay">
                <a-menu-item @click="changeIsAll('1')">
                  全选所有页
                </a-menu-item>
                <a-menu-item @click="changeIsAll('2')">
                  全选当前页
                </a-menu-item>
              </a-menu>
            </a-dropdown> -->
        </div>
        <div>
          <a-button style="margin-left: 12px" @click="allOperation(1)" >导出</a-button>
          <a-button style="margin-left: 12px" @click="allOperation(2)" >激活</a-button>
          <a-button style="margin-left: 12px" @click="allOperation(3)" >停用</a-button>
          <a-button style="margin-left: 12px" @click="allOperation(4)" >合并</a-button>
        </div>
      </div>
      <a-modal
        title="属性规范化"
        :visible="visible"
        @ok="handleSearch"
        @cancel="()=>this.visible = false"
        ok-text="确认" 
        cancel-text="取消"
        destroyOnClose 
        :width='800'
      >
      <div class="model">
        <a-table 
          :columns="columns3" 
          :data-source="UserAttrListData || []"
          :pagination="false"
          :rowKey='null' 
          bordered
        >
         <span slot="inpt" slot-scope="text, record, index">
           <a-select
              placeholder="请输入或选择"
              style="width: 200px"      
              @change="(value)=> handleChange(value, record, index)"
            >               
              <a-select-option :value="item.userAttrName" v-for="(item, i) in userGroupData" :key="i">
                {{item.userAttrName}}
              </a-select-option>
            </a-select>
            <!-- <a-input placeholder="请输入" @change="(e)=> changeModelInput(record, index,e)" /> -->
         </span> 
        </a-table>
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
        title="用户合并"
        :visible="combineModel"
        destroyOnClose 
        ok-text="确认" 
        cancel-text="取消"
        @cancel="()=>this.combineModel = false"
        @ok="toCombine"
      >
      <p>请选择以下哪条账号为准</p>
        <a-table 
          :columns="columns2" 
          :data-source="combineData || []"
          :pagination="false"
          :rowKey='record=>record.id' 
          bordered
        >
         <span slot="check" slot-scope="text, record, index">
           <a-radio @change="(e) => onChangeCheck(e.target.checked, record.id)" :checked="record.id == aimId"></a-radio>
          </span> 
        </a-table>
    </a-modal>
    
  </div>
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
    width: 50,
    scopedSlots: { customRender: 'index' },
  },
  {
    title: '用户状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    scopedSlots: { customRender: 'status' }, //0未激活 1激活
  },
  {
    title: '用户记录类型',
    dataIndex: 'type',
    key: 'type',
    align: 'center',
    scopedSlots: { customRender: 'type' }, //1读者 2工作人员
  },
  {
    title: '用户类型',
    key: 'userGroup',
    align: 'center',
    dataIndex: 'userGroup',
  },
  {
    title: '姓名',
    key: 'name',
    align: 'center',
    dataIndex: 'name',
  },
  {
    title: '账号',
    key: 'alias',
    align: 'center',
    dataIndex: 'alias',
  },
  {
    title: '证号',
    key: 'barcode',
    align: 'center',
    dataIndex: 'barcode',
  },
  {
    title: '手机号',
    key: 'phone',
    align: 'center',
    dataIndex: 'phone',
  },
  {
    title: '注册日期',
    key: 'regDate',
    align: 'center',
    dataIndex: 'regDate',
  },
  {
    title: '失效日期',
    key: 'expirationDate',
    align: 'center',
    dataIndex: 'expirationDate',
  },
    {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' },
  },
];

export default {
  data() {
    return {
      searchParams:{ 
        type: this.type,  //1读者 2工作人员 null为全部
        searchField: '1', //1账号，2证号，3姓名
        searchContent: '', //查询内容
        status: null, // 0未激活 1已激活 null全部
        regDateStart: null,  //注册日期起
        regDateEnd: null,    //注册日期末
        expirationDateStart: null, //失效日期起
        expirationDateEnd: null,  // 失效日期末
        userGroups: null,  //用户类型
        page: 1,
        rows: 10,
        fid: this.getCookie("fid") ? this.getCookie("fid") : '' ,  
      },
      moment,
      columns,
      columns2,
      columns3,
      locale,
      filterShow: true,
      visible: false,
      userGroupData:[], //搜索条件的下拉列表
      tableData: [],
      totalNum: null,
      ids: [], //删除id
      exportModel: false,
      combineModel: false,
      combineData: [],
      aimId: null,
      UserAttrListData: [],
      normUserAttr: {},
    };
  },
  created: function(){
    console.log("1123")
    this.getTableData();
    this.getSelectList();
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

    handleChange(value, record, index){
      const userAttrId = this.userGroupData.filter(item => item.userAttrName == value)[0].id;
      this.normUserAttr[index] = {oldAttrName: record.oldAttrName ? record.oldAttrName : '', userAttrId, userAttrName: value}
    },
    getSelectList(){
      this.$api.getUserAttrList({
        fid: this.getCookie("fid") ? this.getCookie("fid") : '',
        userAttrType: "1",//类型 1读者类型 2院系 3专业 4班级
        isOpen: null,//是否启用 0不启用 1启用 全部传null
        page:1,
        rows:1000
      }).then((res)=>{
        const result = JSON.parse(res)
        this.userGroupData = result.data.proxyList
      })
    },
    getTableData(){
        this.$api.getUserList({...this.searchParams}).then((res)=>{
        const result = JSON.parse(res)
        if(result.success) {
          this.tableData = result.data.userList;
          this.totalNum = result.data.totalNum;
                    console.log("123", this.tableData )
        } else {
        this.$message.error(result.message);
        }
      });
    },
  topSelectChange(val) {
      this.searchParams.searchField = val; //搜索类型
    },
  changeStatus(val) {// //用户状态 0未激活 1已激活
     this.searchParams.status = val;
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
  isShowFilter() {
      this.filterShow = !this.filterShow;//是否显示筛选条件
    },
  handleMenuClick(val) {// 右上角属性规范化
      this.visible =true;
      this.userAttrType = val.key;
      const params = {
          fid: this.searchParams.fid,
          userAttrType: val.key
      }
      this.$api.getAttrList({...params}).then((res)=>{
      const result = JSON.parse(res)
      if(result.success) {
         this.UserAttrListData = result.data;
      } else {
      this.$message.error(result.message);
      }
    });
 
    },
  addUser(addType,record) {  // 0新增用户 1修改用户
      this.addType = addType
    if (addType === '0') {
      this.record = {}
    } else {
      this.record = record
    }
    this.$router.push({path: '/addReader', query:{ record: this.record }})
    },
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
      const result = JSON.parse(res)
      if(result.success) {
        this.$message.success(result.message);
        this.visible = false
        this.normUserAttr = {}
      } else {
        this.$message.error(result.message);
      }
    });
    },
  changeTable(page, rows) {
      this.searchParams.page = page;
      this.searchParams.rows = rows;
      this.getTableData();
    },
  allOperation(val) {
    switch(val) {
    case 1:
      this.mentExport()
        break;
    case 2:
      this.Allactivate("1")
        break;
    case 3:
      this.Allactivate("0")
        break;
    case 4:
      this.beforeCombineUsers()
        break;
    }
      //导出 激活 停用 合并 
    },
  mentExport() {
      this.$api.mentExport({...this.searchParams}).then((res)=>{
      const result = JSON.parse(res)
      if(result.success) {
        this.getMentExport();
      } else {
      this.$message.error(result.message);
      }
    });
  },
  getMentExport() {
    this.exportModel = true;
    this.Time = setInterval(()=>{
      this.$api.getMentExport({fid: this.searchParams.fid}).then((res)=>{
        const result = JSON.parse(res)
        if(result.data.success == 2 ) {
          clearInterval(this.Time)
          this.exportModel = false;
          window.open(result.data.downLoadUrl)
        } else if(result.data.success == 1) {
          this.$message.error(result.message);
          this.exportModel = false;
          clearInterval(this.Time)
        } else {
        }
      });
    },2000)
  },
  Allactivate(flag) {
    if (this.ids.length == 0) {
      this.$message.info("请选择数据");
    } else {
      this.activateDeactivate(flag, this.ids)
    }

  },
  activateDeactivate(val,ids) {
    const params ={
      ids,
      flag: val
    }
    this.$api.activateDeactivate(params).then((res)=>{
        const result = JSON.parse(res)
        if(result.success) {
          this.$message.success(result.message);
          this.getTableData();
        } else {
        this.$message.error(result.message);
        }
      });
    },
    beforeCombineUsers() {
      if(this.ids.length == 0) {
         this.$message.info("请选择数据");
      } else {
        this.combineModel = true,
        this.$api.beforeCombineUsers({ids: this.ids}).then((res)=>{
            const result = JSON.parse(res)
            if(result.success) {
             this.combineData = result.data;
            } else {
            this.$message.error(result.message);
            }
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
     this.$api.toCombine({ids: this.ids,aimId: this.aimId}).then((res)=>{
        const result = JSON.parse(res)
        if(result.success) {
           this.combineModel = false
           this.$message.success(result.message);
        } else {
           this.$message.error(result.message);
        }
      });
    }
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
  justify-content: space-between;
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
  height: 500px;
  overflow: auto;
}
</style>
