<template>
  <a-spin :spinning="spinning">
  <div id="MainContainer">
      <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
      <div class="title">基本信息</div>
       <a-row :gutter="24" class="top">
        <a-col span="6">
          <a-form-item label="姓名" :label-col="labelCol" :wrapper-col="wrapperCol" >
            <a-input v-decorator="[ 'name',{ rules: [{required: true,message: '请输入!',},], initialValue: record.name || undefined },]" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col span="6"> 
          <a-form-item label="用户类型" :label-col="labelCol" :wrapper-col="wrapperCol" >
            <a-select @change="(e)=>selectUserType(e)" v-decorator="['userGroupId',{ rules: [{ required: true, message: '请选择!' }],initialValue: (userGroupData[0] || {}).userGroupId || undefined },]" placeholder="请选择">
              <a-select-option :value="Number(item.userGroupId)" v-for="(item, i) in userGroupData" :key="i">
                {{item.userGroupName}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col span="6"> 
         <a-form-item label="生效日期" :label-col="labelCol" :wrapper-col="wrapperCol" >
            <a-date-picker style="width: 100%" v-decorator="['regDate', { rules: [{required: true,message: '请选择!',},],initialValue: formType =='updata' && record.regDate ? moment(record.regDate, 'YYYY-MM-DD') : undefined, },]" :locale="locale" />
          </a-form-item>
        </a-col>
        <a-col span="6"> 
          <a-form-item label="失效日期" :label-col="labelCol" :wrapper-col="wrapperCol" >
            <a-date-picker style="width: 100%" v-decorator="['expirationDate', { rules: [{required: true,message: '请选择!',},],initialValue: formType =='updata' &&  record.expirationDate ? moment(record.expirationDate, 'YYYY-MM-DD') : undefined  },]" :locale="locale" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="24" class="top">
        <a-col span="6">
           <a-form-item label="手机号" :label-col="labelCol" :wrapper-col="wrapperCol" >
            <a-input :disabled='formType == "updata" && record.phone'  v-decorator="[ 'phone',{ rules: [{required: false ,message: '请输入!',},], initialValue: record.phone || undefined},]" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col span="6">
          <a-form-item label="院系" :label-col="labelCol" :wrapper-col="wrapperCol" >
            <a-select v-decorator="['collegeDeptId',{ rules: [{ required: false, message: '请选择!' }],initialValue: record.collegeDeptId || undefined  },]" placeholder="请选择">
              <a-select-option :value="item.userAttrId" v-for="(item, i) in collegeDeptData" :key="i">
                {{item.userAttrName}}
              </a-select-option>
              </a-select>
          </a-form-item>
        </a-col>
        <a-col span="6">
          <a-form-item label="地址" :label-col="labelCol" :wrapper-col="wrapperCol" >
            <a-input v-decorator="[ 'address',{ rules: [{required: false,message: '请输入!',},],initialValue: record.address || undefined  },]" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col span="6">
           <a-form-item label="性别" :label-col="labelCol" :wrapper-col="wrapperCol" >
            <a-radio-group v-decorator="[ 'gender',{ rules: [{required: false,message: '请输入!',},],initialValue: record.gender || '0' },]">
              <a-radio value="0">男</a-radio>
              <a-radio value="1">女</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>  

    <a-row :gutter="24" class="top">
       <a-col span="6">
          <a-form-item label="专业" :label-col="labelCol" :wrapper-col="wrapperCol" >
            <a-select v-decorator="['majorId',{ rules: [{ required: false, message: '请选择!' }],initialValue: record.majorId || undefined },]" placeholder="请选择">
              <a-select-option :value="item.userAttrId" v-for="(item, i) in majorData" :key="i">
                {{item.userAttrName}}
              </a-select-option>
            </a-select>
          </a-form-item>
       </a-col>
      <a-col span="6">
         <a-form-item label="班级" :label-col="labelCol" :wrapper-col="wrapperCol" >
             <a-select v-decorator="['collegeClassId',{ rules: [{ required: false, message: '请选择!' }],initialValue: record.collegeClassId || undefined },]" placeholder="请选择">
              <a-select-option :value="item.userAttrId" v-for="(item, i) in collegeClassData" :key="i">
                {{item.userAttrName}}
              </a-select-option>
            </a-select>
          </a-form-item>
       </a-col>
       <a-col span="6">
         <a-form-item label="读者证号" :label-col="labelCol" :wrapper-col="wrapperCol" >
            <a-input v-decorator="[ 'content',{ rules: [{required: true, message: '请输入!',},],initialValue: record.barCode || undefined },]" placeholder="请输入" :disabled="formType =='add' ? false : true" />
          </a-form-item>
       </a-col>
       <a-col span="6">
          <a-form-item label="账号" :label-col="labelCol" :wrapper-col="wrapperCol" >
            <a-input v-decorator="[ 'primaryId',{ rules: [{required: true, message: '请输入!',},],initialValue: record.primaryId || undefined },]" placeholder="请输入" />
          </a-form-item>
       </a-col>
    </a-row>  

    <a-row :gutter="24" class="top">
      <a-col span="6">
         <a-form-item label="密码" :label-col="labelCol" :wrapper-col="wrapperCol" >
            <a-input-password v-decorator="[ 'password',{ rules: [{required: formType =='add' ? true : false, message: '请输入!',},],initialValue: record.password || undefined },]" placeholder="请输入" />
          </a-form-item>
      </a-col>
      <a-col span="6">
        <a-form-item label="邮箱" :label-col="labelCol" :wrapper-col="wrapperCol" >
            <a-input v-decorator="[ 'email',{ rules: [{required: false,message: '请输入!',},],initialValue: record.email || undefined },]" placeholder="请输入" />
          </a-form-item>
      </a-col>
    </a-row>   
    </a-form>
    <div v-show="(this.record || {}).recordTypeCode =='1' && this.formType == 'updata'">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="角色" v-if="this.record.cxuId">
           <div class="tableheader">
           <a-button style="marginRight: 10px" @click="deletCxRoles('all')" >删除</a-button>
           <a-button  @click="()=> this.addcxRolesModal = true" >添加角色</a-button>
          </div>
          <div class="tableCont">
            <a-table 
              :columns="cxRoles" 
              :data-source="cxByUserData.role || []"
              :pagination="false"
               bordered
              :row-selection="rowSelection33" 
              :rowKey='record=>record.roleid' 
              :scroll="{
                  x: null,
                  y: 250,
                }"
            >
              <span slot="index" slot-scope="text, record, index">{{index + 1}}</span> 
              <span slot="action" slot-scope="text, record">
                <a @click="deletCxRoles('one', record)">删除</a>
              </span>
            </a-table>
          </div>
        </a-tab-pane>
        <!-- <a-tab-pane key="2" tab="组织架构" force-render>
          <div class="tableheader">
           <a-button style="marginRight: 10px" @click="deletUserGroup()" >删除</a-button>
           <a-button  @click="" >添加</a-button>
          </div>
          <div class="tableCont">
            <a-table 
              :columns="userGroup" 
              :data-source="combinedData || []"
              :pagination="false"
              bordered
              :scroll="{
                  x: null,
                  y: 250,
                }"
            >
              <span slot="index" slot-scope="text, record, index">{{index + 1}}</span> 
              <span slot="action" slot-scope="text, record">
                <a @click="deletCxRoles(record)">删除</a>
              </span>
            </a-table>
          </div>
        </a-tab-pane> -->
        <a-tab-pane key="3" tab="权限管理">
          <div>
           <a-input-search placeholder="请输入搜索内容" style="width: 200px" @search="onSearch" />
           <a-button style="float: right" @click="openUserModal" >添加权限</a-button>
          </div>
          <div class="tableCont">
            <a-table 
              :columns="columns" 
              :data-source="userData || []"
              :pagination="false"
              bordered
              :scroll="{
                  x: null,
                  y: 250,
                }"
            >
              <span slot="index" slot-scope="text, record, index">{{index + 1}}</span> 
              <span slot="action" slot-scope="text, record">
                <a @click="delet(record)">删除</a>
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
        </a-tab-pane>
      </a-tabs>
    </div>
    <div class="footer">
        <a-button style="margin-right: 12px" @click="back">返回</a-button>
        <a-button type="primary" html-type="submit" @click="handleSearch">保存</a-button>
    </div>
    <a-modal
      title="添加权限"
      :visible="addUserModal"
      @ok="handleModalSubmit"
      @cancel="()=> this.addUserModal = false"
      ok-text="确认" 
      cancel-text="取消"
      destroyOnClose
      :width='1000'
    >
    <div class="model">
       <a-input-search placeholder="请输入搜索内容" style="width: 200px" @search="onModalSearch" />
       <div class="modalTable">
       <a-table 
        :columns="modalColumns" 
        :data-source="userModalData || []"
        :pagination="false"
         bordered
         destroyOnClose
        :row-selection="rowSelection" 
        :rowKey='record=>record.roleId' 
        :scroll="{
            x: null,
            y: windowHeight,
          }"
      >
        <span slot="index" slot-scope="text, record, index">{{index + 1}}</span> 
      </a-table>
      <Pagenation
        :page="searchModalParams.pageNum"
        :pageSize="searchModalParams.pageSize"
        :selectOption="[10, 20, 50, 100]"
        :totle="modalTotalNum"
        @changeTable="changeModalTable"
      />
      </div>
    </div>
    </a-modal>
    <a-modal
      title="添加角色"
      :visible="addcxRolesModal"
      @cancel="()=> this.addcxRolesModal = false"
      @ok="handleCxRolesSubmit"
      destroyOnClose
      ok-text="确认" 
      cancel-text="取消"
      :width='1000'
    >
    <div class="model">
       <!-- <a-input-search placeholder="请输入搜索内容" style="width: 200px" @search="onModalSearch" /> -->
       <div class="modalTable">
          <a-table 
            :columns="cxRoles2" 
            :data-source="cxRolesData.list || []"
            :pagination="false"
             bordered
            :row-selection="rowSelection3" 
            :rowKey='record=>record.roleid' 
            :scroll="{
                x: null,
                y: windowHeight,
              }"
          >
            <span slot="index" slot-scope="text, record, index">{{index + 1}}</span> 
          </a-table>
          <Pagenation
            :page="cxRolesParams.pageNum"
            :pageSize="cxRolesParams.pageSize"
            :selectOption="[10, 20, 50, 100]"
            :totle="cxRolesData.totalCount"
            @changeTable="changeCxRoles"
          />
      </div>
    </div>
    </a-modal>
  </div>
  </a-spin>
</template>

<script>
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import Pagenation from "./Pagenation/index.vue";
const cxRoles = [
    {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    width: 50,
    scopedSlots: { customRender: 'index' },
  },
  {
    title: '角色名称',
    dataIndex: 'roleName',
    key: 'roleName',
    align: 'center',
    width: 200,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    width: 100,
    scopedSlots: { customRender: 'action' },
  },
]
const cxRoles2 = [
    {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    width: 50,
    scopedSlots: { customRender: 'index' },
  },
  {
    title: '角色名称',
    dataIndex: 'roleName',
    key: 'roleName',
    align: 'center',
    width: 200,
  },
]
const userGroup = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    width: 50,
    scopedSlots: { customRender: 'index' },
  },
  {
    title: '组织架构',
    dataIndex: 'userGroupName',
    key: 'userGroupName',
    align: 'center',
    width: 200,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    width: 100,
    scopedSlots: { customRender: 'action' },
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
    title: '权限代码',
    dataIndex: 'roleId',
    key: 'roleId',
    align: 'center',
    width: 100,
  },
    {
    title: '权限名称',
    dataIndex: 'roleName',
    key: 'roleName',
    align: 'center',
    width: 100,
  },
    {
    title: '权限说明',
    dataIndex: 'remark',
    key: 'remark',
    align: 'center',
    width: 100,
  },
  {
    title: '所属图书馆',
    dataIndex: 'libName',
    key: 'libName',
    align: 'center',
    width: 100,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    width: 100,
    scopedSlots: { customRender: 'action' },
  },
]
const modalColumns = [
    {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    width: 100,
    scopedSlots: { customRender: 'index' },
  },
  {
    title: '权限代码',
    dataIndex: 'roleId',
    key: 'roleId',
    align: 'center',
  },
    {
    title: '权限名称',
    dataIndex: 'roleName',
    key: 'roleName',
    align: 'center',
  },
    {
    title: '权限说明',
    dataIndex: 'remark',
    key: 'remark',
    align: 'center',
  },
  {
    title: '所属图书馆',
    dataIndex: 'libName',
    key: 'libName',
    align: 'center',
  },
]
export default {
  data() {
    return {
       labelCol: { span: 6 },
       wrapperCol: { span: 16 },
       labelCol2: { span: 2 },
       wrapperCol2: { span: 21 },
       formLayout: 'horizontal',
       form: this.$form.createForm(this, { name: 'coordinated' }),
       moment,
       locale,
       userGroupData: [],  // 用户类型
       collegeDeptData: [], //院系
       majorData: [], //专业
       collegeClassData: [], //班级
       spinning: false,
       userData: [],
       columns,
       cxRoles,
       cxRoles2,
       userGroup,
       searchParams: {
         pageNum: 1,
         pageSize: 10,
         searchValue: '',
         userId: null,
       },
       totalNum: null,
       cxRolesParams: {
         pageNum: 1,
         pageSize: 10,
       },
       cxUserGroupParams: {
         pageNum: 1,
         pageSize: 10,
       },
       cxRolesData: [],
       addUserModal: false,
       modalColumns,
       searchModalParams: {
         pageNum: 1,
         pageSize: 10,
         searchValue: '',
         userId: null, 
       },
       userModalData: [],
       modalTotalNum: null,
       windowWidth: window.innerWidth, //实时屏幕宽度
       windowHeight: window.innerHeight - 650, //实时屏幕高度
       roleIds: [], //权限
       roleIds3: [], //角色弹框
       roleIds33: [], //角色列表
       roleIds2: [], //组织架构列表
       type: '',
       addcxRolesModal: false,
       cxByUserData: [],
    };
  },
  created: function(){
  this.record = this.$route.query.record;
  this.searchParams.userId = this.$route.query.record.userId;
  this.searchModalParams.userId = this.$route.query.record.userId;
  this.type = this.$route.query.type;
  this.formType = this.$route.query.formType;   
  console.log("record", this.record)
  this.$api.getUserType({  // 用户类型下拉
      recordTypeCode:'2'
   }).then((res)=>{
     const result = res;
     this.userGroupData = result.data;
    if(this.formType==='add') {
      this.selectUserType( this.userGroupData[0].userGroupId);
      this.form.setFieldsValue({ regDate: moment(new Date(), 'YYYY-MM-DD')}) // 生效时间默认当前日期
    }
   });


  this.$api.getUserAttrList().then((res)=>{   // 院系下拉 专业下拉  班级下拉
    const result = res;
    if(result.success) {
      this.collegeDeptData = result.data.filter(item => item.userAttrType === '4');
      this.majorData = result.data.filter(item => item.userAttrType === '10');
      this.collegeClassData = result.data.filter(item => item.userAttrType === '6');
      
    }
  })
  if(this.formType == 'updata') {
    this.getUserList();
    this.getCxRoles();   // 添加角色弹框数据源
    // this.getCxUserGroup(); // 组织架构弹框数据源

    this.getCxByUserId();  // 根据userId获取用户角色和组织架构接口
  }

  },
  props:['record'],
  watch: {
     msg() {
      console.log("@@@", this.record)
   } 

  },
  components: {
    Pagenation,
  },
    computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys) => {
          this.roleIds = selectedRowKeys;
        },
        selectedRowKeys: this.roleIds,
      };
    },
    rowSelection3() {
      return {
        onChange: (selectedRowKeys) => {
          this.roleIds3 = selectedRowKeys;
        },
        selectedRowKeys: this.roleIds3,
      };
    },
    rowSelection33() {
       return {
        onChange: (selectedRowKeys) => {
          this.roleIds33 = selectedRowKeys;
        },
        selectedRowKeys: this.roleIds33,
      };
    }
  },
  methods: {
    //获取cookie
    getCookie(name){
        var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
        if(arr != null) return unescape(arr[2]); 
        return false;
    },
    handleSearch(e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
        if (error === null) {
            const params = {
              ...values,
              userId: this.formType == 'updata' ? this.record.userId : undefined,   //判断是新增还是修改
              regDate: moment(values.regDate).format('YYYY-MM-DD'),
              expirationDate: moment(values.expirationDate).format('YYYY-MM-DD'),
              majorName: (this.majorData.filter(item => item.userAttrId == values.majorId)[0] || {}).userAttrName,
              collegeClass: (this.collegeClassData.filter(item => item.userAttrId == values.collegeClassId)[0] || {}) .userAttrName,
              collegeDept: (this.collegeDeptData.filter(item => item.userAttrId == values.collegeDeptId)[0] || {}).userAttrName,

            }
            if(this.formType == 'updata') {
               this.spinning = true;
              this.$api.editUser(params).then((res)=>{
                const result = res
                if(result.success) {
                  this.spinning = false;
                  this.$message.success(result.message);
                  window.location.href="javascript:history.go(-1)"
                } else {
                  this.spinning = false;
                  this.$message.error(result.message);
                }
              })
            } else {
              this.spinning = true;
              this.$api.addUser(params).then((res)=>{
                const result = res
                if(result.success) {
                  this.spinning = false;
                  this.$message.success(result.message);
                  window.location.href="javascript:history.go(-1)"
                } else {
                  this.spinning = false;
                  this.$message.error(result.message);
                }
              })
            }
        }
      });
    },
    back() {
      window.location.href="javascript:history.go(-1)"
    },
    onSearch(val) {
      this.searchParams.searchValue = val; //搜索
      this.getUserList();
    },
    getUserList() {
      this.spinning = true;
      this.$api.getUserList({...this.searchParams}).then((res)=>{
          const result = res
          if(result.success) {
            this.spinning = false;
            this.userData = result.data.result;
            this.totalNum = result.data.totalNum;
          } else {
            this.$message.error(result.message);
          }
          this.spinning = false;
        })
    },
    getCxByUserId() {
      this.spinning = true;
      const params = {
        fid: this.getCookie("fid") ? this.getCookie("fid") : "",
        userIds: this.record.cxuId,
      }
      this.$api.getCxByUserId({ ...params }).then((res)=>{
          const result = res
          if(result.success) {
            this.spinning = false;
            this.cxByUserData = result.data;
            this.combinedData = [];
            result.data.combinedName.map(item => {
              this.combinedData.push({ userGroupName: item });
            })
          } else {
            this.$message.error(result.message);
          }
          this.spinning = false;
        })
    },
    getCxRoles() {
      this.spinning = true;
      this.$api.getCxRoles({...this.cxRolesParams}).then((res)=>{
          const result = res
          if(result.success) {
            this.cxRolesData = result.data          
          } else {
            this.$message.error(result.message);
          }
          this.spinning = false;
        })
    },
    getCxUserGroup() {
      this.spinning = true;
      this.$api.getCxUserGroup({...this.cxUserGroupParams}).then((res)=>{
          const result = res
          if(result.success) {
            this.cxUserGroupData = result.data          
          } else {
            this.$message.error(result.message);
          }
          this.spinning = false;
        })
    },
    handleCxRolesSubmit() {
      const params = {
        userId: this.record.userId,
        role: this.roleIds3.join(),
      }
      this.spinning = true; 
      this.$api.updateCxRole({...params}).then((res)=>{
        const result = res
        if(result.success) {
          this.addcxRolesModal = false;
          this.a = setTimeout(()=>{
            this.getCxByUserId();
          },2000)

          this.$message.success(result.message);
        } else {
          this.spinning = false;
          this.$message.error(result.message);
        }
        this.roleIds3 =[];
      })
    },
    deletCxRoles(type, record) {
      const array = [];
      this.cxByUserData.role.map(item => {
        array.push(item.roleid)
      }) 
      if(type == 'all') {
        if(this.roleIds33.length == 0) {
          this.$message.info("请选择数据");
        } else {
          let a=new Set(this.roleIds33);
          let b=new Set(array);
          let arr = Array.from(new Set([...b].filter(x => !a.has(x))));
          const params = {
            userId: this.record.userId,
            role: arr.join(),
            flag: '1',
          }
          this.spinning = true; 
          this.$api.updateCxRole({...params}).then((res)=>{
            const result = res
            if(result.success) {
              this.a = setTimeout(()=>{
                this.getCxByUserId();
              },2000)
              this.$message.success(result.message);
            } else {
              this.spinning = false;
              this.$message.error(result.message);
            }
            this.roleIds3 =[];
          })
        }
      } else {
        let a=new Set([record.roleid]);
        let b=new Set(array);
        let arr = Array.from(new Set([...b].filter(x => !a.has(x))));
        const params = {
          userId: this.record.userId,
          role: arr.join(),
          flag: '1',
        }
        this.spinning = true; 
        this.$api.updateCxRole({...params}).then((res)=>{
          const result = res
          if(result.success) {
            this.a = setTimeout(()=>{
              this.getCxByUserId();
            },2000)
            this.$message.success(result.message);
          } else {
            this.spinning = false;
            this.$message.error(result.message);
          }
        })
      }
    },
    changeCxRoles(page, rows) {
       this.cxRolesParams = {
         ...this.cxRolesParams,
         pageNum: page,
         pageSize: rows 
      }
      this.getCxRoles();
    },
    changeTable(page, rows) {
       this.searchParams = {
         ...this.searchParams,
         pageNum: page,
         pageSize: rows 
       }
      this.getUserList();
    },
    delet(record) {
      this.spinning = true;
      this.$api.deleteUserList({roleId: record.roleId, userId: this.searchParams.userId }).then((res)=>{
        const result = res
        if(result.success) {
          this.spinning = false;
           this.$message.success(result.message);
          this.getUserList()
        } else {
          this.$message.error(result.message);
        }
        this.spinning = false;
      })
    },

    openUserModal() {
      this.addUserModal = true;
      this.spinning = true;
      this.$api.getModalUserList({...this.searchModalParams}).then((res)=>{
          const result = res
          if(result.success) {
            this.spinning = false;
            this.userModalData = result.data.result;
            this.modalTotalNum = result.data.totalNum;
          } else {
            this.$message.error(result.message);
          }
          this.spinning = false;
        })
    },
    onModalSearch(val) {
      this.searchModalParams.searchValue = val; //搜索
      this.spinning = true;
      this.$api.getModalUserList({...this.searchModalParams}).then((res)=>{
        const result = res
        if(result.success) {
          this.spinning = false;
          this.userModalData = result.data.result;
          this.modalTotalNum = result.data.totalNum;
        } else {
          this.$message.error(result.message);
        }
        this.spinning = false;
      })
    },
    changeModalTable(page, rows) {
       this.searchModalParams = {
         ...this.searchModalParams,
         pageNum: page,
         pageSize: rows 
       }
       this.spinning = true;
       this.$api.getModalUserList({...this.searchModalParams}).then((res)=>{
        const result = res
        if(result.success) {
          this.spinning = false;
          this.userModalData = result.data.result;
          this.modalTotalNum = result.data.totalNum;
        } else {
          this.$message.error(result.message);
        }
        this.spinning = false;
    });
    },
    handleModalSubmit() {
      const params = {
        roleIds: this.roleIds,
        userId: this.searchModalParams.userId,
      }
      this.spinning = true;
      this.$api.addModalUserList({...params}).then((res)=>{
        const result = res
        if(result.success) {
          this.addUserModal = false;
           this.$message.success(result.message);
          this.getUserList();
        } else {
          this.$message.error(result.message);
        }
        this.spinning = false;
        this.roleIds = [];
    });
    },
    selectUserType(e) {
      const target = this.userGroupData.filter(item => e === item.userGroupId)[0];
      if (target) {
        this.form.setFieldsValue({ expirationDate: target.defaultExpirationDate ? moment(target.defaultExpirationDate, 'YYYY-MM-DD') : undefined })
      }
    }
  },
};

</script>

<style scoped>
 #MainContainer{
   padding: 20px;
 }
 .title{
   font-size: 16px;
   color: #000;
   font-weight: bold;
 }
 .top{
   margin-top: 20px;
 }
 .tableTitle{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 40px;
    line-height: 40px;
 }
 .tableheader{
   display: flex;
   justify-content: flex-end;
 }
 .tableCont{
    margin-top: 10px;
    height: 350px;
 }
 .modalTable{
   margin-top: 10px;
   height: 350px;
 }
.footer{
  padding: 0 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  left: 0;
  box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.13);
}
.model{
  height: 450px;
  overflow: auto;
}

</style>