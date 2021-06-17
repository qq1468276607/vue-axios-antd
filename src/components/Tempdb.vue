<template>
  <div id="app">
    <a-spin :spinning="spinning">
      <div class="search">
        <a-input-group compact style="width: 300px; margin-left: 10px">
          <a-select
            style="width: 100px"
            :default-value="param.searchField"
            @change="searchFiled"
          >
            <a-select-option :value="null">全部</a-select-option>
            <a-select-option :value="'1'">读者账号</a-select-option>
            <a-select-option :value="'2'"> 读者证号 </a-select-option>
            <a-select-option :value="'3'"> 姓名 </a-select-option>
            <a-select-option :value="'4'"> 手机号 </a-select-option>
          </a-select>
          <a-input-search style="width: 200px" @search="onSearch" />
        </a-input-group>
        <a-button
          style="margin-left: 10px"
          @click="
            () => {
              this.visiableAdvance = true;
            }
          "
          >高级</a-button
        >
        <span class="label" style="margin-left: 10px">注册状态：</span>
        <a-radio-group
          :default-value="param.regFlags"
          @change="onRadioChange"
          style="line-heigth: 32px; margin-top: 5px"
        >
          <a-radio :value="null"> 全部 </a-radio>
          <a-radio :value="1"> 已注册 </a-radio>
          <a-radio :value="0"> 未注册 </a-radio>
          <!-- <a-radio :value="2"> 注册失败 </a-radio> -->
        </a-radio-group>
      </div>
      <div class="table">
        <a-table
          :columns="columns"
          :data-source="data"
          :row-selection="rowSelection"
          :pagination="false"
          :rowKey="(record, index) => record.id"
          bordered
          :scroll="{
            x: windowWidth,
            y: windowHeight,
          }"
        >
          <span slot="index" slot-scope="text, record, index">
            {{ (param.pageNum - 1) * param.pageSize + index + 1 }}
          </span>
          <span slot="status" slot-scope="text">
            <span v-if="text == 0"><a-badge status="default" />未注册</span>
            <span v-if="text == 1"><a-badge status="success" />已注册</span>
            <span v-if="text == 2"><a-badge status="error" />注册失败</span>
          </span>
          <!-- <span slot="source" slot-scope="text">
            <span v-if="text == 0">LSP</span>
          </span> -->
          <span slot="gender" slot-scope="text">
            <span v-if="text == 0">男</span>
            <span v-if="text == 1">女</span>
          </span>
          <span slot="createDate" slot-scope="createDate">
            <span >{{whatTime(createDate)}}</span>
          </span>
          <span slot="regDate" slot-scope="regDate">
            <span >{{whatTime(regDate)}}</span>
          </span>
          <span slot="action" slot-scope="text, record">
            <a v-if="record.regFlag != 1" @click="checkOne('1',record)">注册</a>
            <a-popconfirm
              title="是否确定删除?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="deleteId(text.primaryId)"
              @cancel="() => {}"
            >
              <a href="#">删除</a>
            </a-popconfirm>           
          </span>
        </a-table>
        <Pagenation
          :page="param.pageNum"
          :pageSize="param.pageSize"
          :selectOption="[10, 20, 50, 100]"
          :totle="total"
          @changeTable="changeTable"
        />
      </div>
      <div class="footer">
        <!-- <div>
        <a-checkbox :default-checked="false" />
        <a-dropdown placement="topCenter">
          <a class="ant-dropdown-link">全选所有页</a>
          <a-menu slot="overlay">
            <a-menu-item @click="changeIsAll(1)"> 全选所有页 </a-menu-item>
            <a-menu-item @click="changeIsAll(2)"> 全选当前页 </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div> -->
        <div>
          <a-button style="margin-left: 12px" @click="deleteId(null)"
            >删除</a-button
          >
          <a-button
            style="margin-left: 12px"
            @click="checkOne('2')"
            :disabled="ids.length > 0 ? false : true"
            >注册</a-button
          >
        </div>







        <a-modal
          v-model="visiable"
          title="注册"
          @ok="OkCheck"
          @cancel="CancelCheck"
          okText="确定"
          cancelText="取消"
          class="modal"
          width=80%
        >
        <div style="height: 400px; overflow: auto;">
          <div style="display: flex; justify-content: space-between; ">
            <div>
              <a-checkbox style="width: 150px" v-model="primaryIdUp">读者帐号递增：</a-checkbox>
              <a-input placeholder="请输入读者账号，自动加1" v-model="formdata.primaryIdUp" style="width: 200px"/>
            </div>
            <div style="width: 50%">
              <a-checkbox style="width: 150px" v-model="userBarcode">读者证号递增：</a-checkbox>
              <a-input placeholder="请输入读者证号，自动加1" v-model="formdata.userBarcode" style="width: 200px"/>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 20px">
            <div>
              <a-checkbox disabled style="width: 150px" v-model="userGroupName">用户类型：</a-checkbox>
              <a-select @change="userTypeChange" placeholder="请选择用户类型" v-model="modelTemp111" style="width: 200px">
                <a-select-option v-for="item in userTypeList" :key="item.userGroupName">
                  {{ item.userGroupName }}
                </a-select-option>
              </a-select>
            </div>
            <div style="width: 50%; display: flex; justify-content: space-between; margin-top: 20px">
              <a-checkbox style="width: 150px" v-model="createDate">注册日期：</a-checkbox>
              <div style="width: calc( 100% - 150px)">
                <a-radio-group name="radioGroup" v-model="zcrq">
                  <a-radio :value="1">
                    临时库注册日期
                  </a-radio>
                  <a-radio :value="2">
                    自定义
                  </a-radio>
                </a-radio-group>
                <a-date-picker :locale="locale" @change="zcrqOnChange" v-if="zcrq == 2" style="width: 130px"/>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 20px">
            <div style="width: 50%; display: flex; justify-content: space-between;">
              <a-checkbox style="width: 150px" v-model="expireDate">到期日期：</a-checkbox>
              <div style="width: calc( 100% - 150px)">
                <a-radio-group name="radioGroup" v-model="dqrq">
                  <a-radio :value="1">
                    临时库到期日期
                  </a-radio>
                  <a-radio :value="2">
                    自定义
                  </a-radio>
                </a-radio-group>
                <a-date-picker :locale="locale" @change="dqrqOnChange" v-if="dqrq == 2" style="width: 130px"/>
              </div>
            </div>
            <div style="width: 50%">
              <a-checkbox style="width: 150px" v-model="passwordValue">密码：</a-checkbox>
              <a-select placeholder="请选择密码类型" v-model="formdata.passwordType" style="width: 200px">
                <a-select-option value=1>
                  与读者账号一致
                </a-select-option>
                <a-select-option value=2>
                  与读者证号一致
                </a-select-option>
                <a-select-option value=3>
                  与身份证后六位一致(无身份证时，密码为帐号)
                </a-select-option>
                <a-select-option value=4>
                  自定义
                </a-select-option>
              </a-select>
              <a-input-password placeholder="请输入密码" v-model="formdata.passwordValue" style="width: 100px" v-if="formdata.passwordType == 4"/>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 20px">
            <div>
              <a-checkbox style="width: 150px" v-model="department">院系：</a-checkbox>
              <a-select @change="departmentChange" placeholder="请选择院系" v-model="modelTemp222" style="width: 200px">
                <a-select-option v-for="item in facultyList" :key="item.userAttrId">
                  {{ item.userAttrName }}
                </a-select-option>
              </a-select>
            </div>
            <div style="width: 50%">
              <a-checkbox style="width: 150px" v-model="collegeYear">年级：</a-checkbox>
              <a-select @change="nianjiChange" placeholder="请选择年级" v-model="modelTemp333" style="width: 200px">
                <a-select-option v-for="item in gradeList" :key="item.userAttrId">
                  {{ item.userAttrName }}
                </a-select-option>
              </a-select>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 20px">
            <div>
              <a-checkbox style="width: 150px" v-model="gender">性别：</a-checkbox>
              <a-select placeholder="请选择院系" v-model="formdata.gender" style="width: 200px">
                <a-select-option value=0>
                  男
                </a-select-option>
                <a-select-option value=1>
                  女
                </a-select-option>
              </a-select>
            </div>
            <div style="width: 50%">
              <a-checkbox style="width: 150px" v-model="eduName">文化程度：</a-checkbox>
              <a-select @change="whcdChange" placeholder="请选择文化程度" v-model="modelTemp444" style="width: 200px">
                <a-select-option v-for="item in educationDegreeList" :key="item.userAttrId">
                  {{ item.userAttrName }}
                </a-select-option>
              </a-select>
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-top: 20px">
            <div>
              <a-checkbox style="width: 150px" v-model="deposit">押金：</a-checkbox>
              <a-input placeholder="请输入押金" v-model="formdata.deposit" style="width: 200px"/>
            </div>
            <div style="width: 50%">
              <a-checkbox style="width: 150px" v-model="prepayment">预付款：</a-checkbox>
              <a-input placeholder="请输入预付款" v-model="formdata.prepayment" style="width: 200px"/>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 20px">
            <div>
              <a-checkbox style="width: 150px" v-model="serviceCharge">手续费：</a-checkbox>
              <a-input placeholder="请输入手续费" v-model="formdata.serviceCharge" style="width: 200px"/>
            </div>
            <div style="width: 50%">
              <a-checkbox style="width: 150px" v-model="positionTitle">职称：</a-checkbox>
              <a-select @change="zcChange" placeholder="请选择职称" v-model="modelTemp555" style="width: 200px">
                <a-select-option v-for="item in professionalTitleList" :key="item.userAttrId">
                  {{ item.userAttrName }}
                </a-select-option>
              </a-select>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 20px">
            <div>
              <a-checkbox style="width: 150px" v-model="job">职业：</a-checkbox>
              <a-select @change="zyChange" placeholder="请选择职业" v-model="modelTemp666" style="width: 200px">
                <a-select-option v-for="item in jobList" :key="item.userAttrId">
                  {{ item.userAttrName }}
                </a-select-option>
              </a-select>
            </div>
            <div style="width: 50%">
              <a-checkbox style="width: 150px" v-model="position">职位：</a-checkbox>
              <a-select @change="zwChange" placeholder="请选择职位" v-model="modelTemp777" style="width: 200px">
                <a-select-option v-for="item in positionList" :key="item.userAttrId">
                  {{ item.userAttrName }}
                </a-select-option>
              </a-select>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 20px">
            <div>
              <a-checkbox style="width: 150px" v-model="collegeDept">部门：</a-checkbox>
              <a-select @change="bmChange" placeholder="请选择部门" v-model="modelTemp888" style="width: 200px">
                <a-select-option v-for="item in departmentList" :key="item.userAttrId">
                  {{ item.userAttrName }}
                </a-select-option>
              </a-select>
            </div>
            <div style="width: 50%">
              <a-checkbox style="width: 150px" v-model="unit">单位：</a-checkbox>
              <a-select @change="dwChange" placeholder="请选择单位" v-model="modelTemp999" style="width: 200px">
                <a-select-option v-for="item in unitList" :key="item.userAttrId">
                  {{ item.userAttrName }}
                </a-select-option>
              </a-select>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 20px">
            <div>
              <a-checkbox style="width: 150px" v-model="collegeClass">班级：</a-checkbox>
              <a-select @change="bjChange" placeholder="请选择班级" v-model="modelTemp000" style="width: 200px">
                <a-select-option v-for="item in classList" :key="item.userAttrId">
                  {{ item.userAttrName }}
                </a-select-option>
              </a-select>
            </div>
            <div style="width: 50%">
              <a-checkbox style="width: 150px" v-model="researcherFlag">科研人员：</a-checkbox>
              <a-switch default-checked v-model="modelTemp001" @change="kyryOnChange"/>
            </div>
          </div>

          <div style="color: red; margin-top: 20px">选中读者证号、帐号复选框时，注册时按照输入的初始证号、帐号自动递增，未选中时按照一卡通读者证号、帐号进行注册</div>
        </div>
        </a-modal>







        <a-modal
          v-model="visiableAdvance"
          title="读者高级检索"
          @ok="handleOk"
          @cancel="handleCancel"
          okText="确定"
          cancelText="取消"
        >
          <a-form
            :form="form"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 17 }"
          >
            <a-form-item label="读者证号">
              <a-input
                v-decorator="['userBarcodeStart',{ rules: [{required: false,message: '请输入!',},],},]"
                placeholder="读者证号起始"
                style="width: 152px"
              />——<a-input
                v-decorator="['userBarcodeEnd',{ rules: [{required: false,message: '请输入!',},],},]"
                placeholder="读者证号结束"
                style="width: 152px"
              />
            </a-form-item>
            <a-form-item label="读者账号">
              <a-input
                v-decorator="['primaryIdStart',{ rules: [{required: false,message: '请输入!',},],},]"
                placeholder="读者账号起始"
                style="width: 152px"
              />——<a-input
                v-decorator="['primaryIdEnd',{ rules: [{required: false,message: '请输入!',},],},]"
                placeholder="读者账号结束"
                style="width: 152px"
              />
            </a-form-item>
            <a-form-item label="数据转入日期">
              <a-range-picker
                :ranges="{
                  Today: [
                    moment(param.craeteDateBegin),
                    moment(param.craeteDateBegin),
                  ],
                }"
                :placeholder="['开始时间', '结束时间']"
                @change="onChange"
              />
            </a-form-item>
          </a-form>
        </a-modal>


        <a-modal
          v-model="visiabledownload"
          title="注册结果"
          @ok="downloadOk"
          @cancel="downloadCancel"
          okText="是"
          cancelText="否"
        >
          <p>
            本次共注册{{downloadTotal}}条读者，成功{{dpwnloadSuccess}}条，失败{{downloadFail}}条；
          </p>
          <p>
            是否下载详细日志
          </p>
        </a-modal>



      </div>
    </a-spin>
  </div>
</template>

<script>
const columns = [
  {
    title: "序号",
    width: 70,
    align: "center",
    scopedSlots: { customRender: "index" },
    fixed: "left",
  },
  {
    title: "注册状态",
    dataIndex: "regFlag",
    key: "regFlag",
    scopedSlots: { customRender: "status" },
    width: 120,
  },

  {
    title: "手机号",
    dataIndex: "phone",
    key: "phone",
    width: 120,
  },
  // {
  //   title: "数据来源",
  //   dataIndex: "source",
  //   key: "source",
  //   scopedSlots: { customRender: "source" },
  //   width: 120,
  // },
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
    width: 120,
  },
  {
    title: "用户类型",
    dataIndex: "userGroup",
    key: "userGroup",
    width: 120,
  },
  {
    title: "读者证号",
    dataIndex: "userBarcode",
    key: "userBarcode",
    width: 120,
  },
  {
    title: "读者账号",
    dataIndex: "primaryId",
    key: "primaryId",
    width: 120,
  },
  {
    title: "身份证号",
    dataIndex: "cardNo",
    key: "cardNo",
    width: 120,
  },
  {
    title: "性别",
    dataIndex: "gender",
    key: "gender",
    scopedSlots: { customRender: "gender" },
    width: 90,
  },
  {
    title: "院系",
    dataIndex: "department",
    key: "department",
    width: 120,
  },
  {
    title: "专业",
    dataIndex: "majorName",
    key: "majorName",
    width: 120,
  },
  {
    title: "班级",
    dataIndex: "collegeClass",
    key: "collegeClass",
    width: 120,
  },
  {
    title: "数据转入时间",
    dataIndex: "createDate",
    key: "createDate",
    scopedSlots: { customRender: "createDate" },
    width: 120,
  },
  {
    title: "注册日期",
    dataIndex: "regDate",
    key: "regDate",
    scopedSlots: { customRender: "regDate" },
    width: 90,
  },
  // {
  //   title: "注册失败原因",
  //   dataIndex: "failReason",
  //   key: "failReason",
  //   width: 120,
  // },
  {
    title: "操作",
    key: "action",
    align: 'center',
    width: 110,
    scopedSlots: { customRender: "action" },
    fixed: "right",
  },
];

const data = [];
import Pagenation from "./Pagenation/index.vue";
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import moment from "moment";
export default {
  name: "TempDB",
  data() {
    return {
      locale,
      downloadTotal: "",
      downloadFail: "",
      dpwnloadSuccess:"",
      visiabledownload: false,

      modelTemp111: "",
      modelTemp222: "",
      modelTemp333: "",
      modelTemp444: "",
      modelTemp555: "",
      modelTemp666: "",
      modelTemp777: "",
      modelTemp888: "",
      modelTemp999: "",
      modelTemp000: "",
      modelTemp001: false,
      zcrq: 1,
      dqrq: 1,


      collegeClass: false,
      collegeDept: false,
      collegeYear: false,
      createDate: false,
      department: false,
      deposit: false,
      eduName: false,
      expireDate: false,
      gender: false,
      job: false,
      passwordValue: false,
      position: false,
      positionTitle: false,
      prepayment: false,
      primaryIdUp: false,
      researcherFlag: false,
      searchKey: false,
      serviceCharge: false,
      tempReaderList: false,
      unit: false,
      userBarcode: false,
      userGroupName: false,

      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      formdata: {
        collegeClass: null,
        collegeClassId: null,
        collegeDept: null,
        collegeDeptId: null,
        collegeYear: null,
        collegeYearId: null,
        createDate: null,
        department: null,
        departmentId: null,
        deposit: null,
        eduId: null,
        eduName: null,
        expireDate: null,
        gender: null,
        job: null,
        jobId: null,
        passwordType: null,
        passwordValue: null,
        position: null,
        positionId: null,
        positionTitle: null,
        positionTitleId: null,
        prepayment: null,
        primaryIdUp: null,
        researcherFlag: "0",
        searchKey: "",
        serviceCharge: null,
        tempReaderList: [],
        unit: null,
        unitId: null,
        userBarcode: null,
        userGroupId: null,
        userGroupName: null,
      },

      classList : [], // 班级
      unitList : [], // 单位
      departmentList : [], // 部门
      positionList : [], // 职位
      jobList : [], // 职业
      professionalTitleList : [], // 职称
      educationDegreeList : [], // 文化程度
      facultyList : [], // 院系
      gradeList : [], // 年级
      userTypeList: [],


      windowWidth: window.innerWidth, //实时屏幕宽度
      windowHeight: window.innerHeight - 280, //实时屏幕高度
      dateFormat: "YYYY/MM/DD",
      monthFormat: "YYYY/MM",
      status: "全部",
      data,
      total: 0,
      columns,
      page: 1,
      pageSize: 10,
      visiable: false,
      visiableAdvance: false,
      ids: [],
      ids1111: [],
      form: this.$form.createForm(this, { name: "coordinated" }),
      param: {
        // checkStatus: null, //审核状态 0未审核 1已审核
        // createDateStart: null, //数据转入日期起
        // createDateEnd: null, //数据转入日期末
        // searchField: null, //查询字段 1账号，2证号，3姓名，4手机号
        // searchContent: null, //查询内容
        // page: 1,
        // rows: 10,
        // userBarcodeBegin: null, //读者证号起
        // userBarcodeEnd: null, //读者证号末
        // primaryIdBegin: null, //读者账号起
        // primaryIdEnd: null, //读者账号末
        // fid: this.getCookie("fid") ? this.getCookie("fid") : "",

        //lastUserId: -1,
        pageNum: 1,
        pageSize: 10,
        regFlags: null, 
        searchField: null, // 查询的类型 primaryId 读者帐号 userBarcode 读者证号
        searchValue: '',
        craeteDateBegin: null, // 创建时间开始
        craeteDateEnd: null, // 创建时间结束
        // 高级搜索
        primaryIdStart: null,// 帐号开始
        primaryIdEnd: null, // 帐号结束
        userBarcodeStart: null,// 证号开始
        userBarcodeEnd: null, // 证号开始
      },
      isActive: null, //激活未激活
      spinning: false, //加载
      opUid: this.getCookie("UID") ? this.getCookie("UID") : "",
      type: '1',   // 批量审核或 1单条审核   
      record: {},
    };
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.ids = selectedRowKeys;
          this.ids2222 = selectedRows;
          this.ids1111 = [];
          for(let i = 0; i<selectedRows.length; i++) {
            this.ids1111.push(selectedRows[i].primaryId);
          }
        },
        selectedRowKeys: this.ids,
      };
    },
  },
  created() {
    this.getData(this.param);
  },
  components: { Pagenation },
  methods: {
    moment,
    downloadOk() {
      this.visiabledownload = false;
      window.open(`/uc/tempReaderManage/getFailTxtDoc?key=${this.failResult}`);
    },

    downloadCancel() {
      this.visiabledownload = false;
    },

    zcrqOnChange(date, dateString) {
      this.formdata.createDate = dateString;
    },

    dqrqOnChange(date, dateString) {
      this.formdata.expireDate = dateString;
    },

    userTypeChange(val) {
      const selectedItem = this.userTypeList.filter(item => item.userGroupName === val)[0]
      this.formdata.userGroupName = selectedItem.userGroupName;
      this.formdata.userGroupId = selectedItem.userGroupId;
    },

    departmentChange(val) {
      const selectedItem = this.facultyList.filter(im => im.userAttrId === val)[0];
      this.formdata.department = selectedItem.userAttrName;
      this.formdata.departmentId = val;
    },

    nianjiChange(val) {
      const selectedItem = this.gradeList.filter(im => im.userAttrId === val)[0];
      this.formdata.collegeYear = selectedItem.userAttrName;
      this.formdata.collegeYearId = val;
    },

    whcdChange(val) {
      const selectedItem = this.educationDegreeList.filter(im => im.userAttrId === val)[0];
      this.formdata.eduName = selectedItem.userAttrName;
      this.formdata.eduId = val;
    },

    zcChange(val) {
      const selectedItem = this.professionalTitleList.filter(im => im.userAttrId === val)[0];
      this.formdata.positionTitle = selectedItem.userAttrName;
      this.formdata.positionTitleId = val;
    },

    zyChange(val) {
      const selectedItem = this.jobList.filter(im => im.userAttrId === val)[0];
      this.formdata.job = selectedItem.userAttrName;
      this.formdata.jobId = val;
    },

    zwChange(val) {
      const selectedItem = this.positionList.filter(im => im.userAttrId === val)[0];
      this.formdata.position = selectedItem.userAttrName;
      this.formdata.positionId = val;
    },

    bmChange(val) {
      const selectedItem = this.departmentList.filter(im => im.userAttrId === val)[0];
      this.formdata.collegeDept = selectedItem.userAttrName;
      this.formdata.collegeDeptId = val;
    },

    dwChange(val) {
      const selectedItem = this.unitList.filter(im => im.userAttrId === val)[0];
      this.formdata.unit = selectedItem.userAttrName;
      this.formdata.unitId = val;
    },

    bjChange(val) {
      const selectedItem = this.classList.filter(im => im.userAttrId === val)[0];
      this.formdata.collegeClass = selectedItem.userAttrName;
      this.formdata.collegeClassId = val;
    },

    kyryOnChange(val) {
      if(val) {
        this.formdata.researcherFlag = "1";
      } else {
        this.formdata.researcherFlag = "0";
      }
    },

    whatTime(time) {
      if(time) {
        return (this.moment(time).format('LL'))
      } else {
        return null
      }
    },
    /*设置cookie*/
    setCookie(name, value, expires) {
      var exp = new Date();
      exp.setTime(exp.getTime() + expires * 1000);
      document.cookie =
        name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },
    //获取cookie
    getCookie(name) {
      var arr = document.cookie.match(
        new RegExp("(^| )" + name + "=([^;]*)(;|$)")
      );
      if (arr != null) return unescape(arr[2]);
      return false;
    },
    //获取数据
    getData(param) {
      this.spinning = true;
      // this.$api.getProxyList(param).then((res) => {
        this.$api.lsklist(param).then((res) => {
        this.spinning = false;
        if (res.success) {
          this.formdata.searchKey = res.data.searchKey;
          this.data = res.data.result || [];
          this.total = res.data.totalNum || 0;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    onChange(dates, dateStrings) {
      this.param = {
        ...this.param,
        createDateStart: dateStrings[0],
        createDateEnd: dateStrings[1],
      };
      // this.getData(this.param);
    },
    onSearch(value) {
      this.param = { ...this.param, searchValue: value };
      this.getData(this.param);
    },
    onRadioChange(e) {
      const status = e.target.value;
      let status111 = null;
      if(status == null) {
        status111 = null
      } else if (status == 1) {
        status111 = ['1']
      } else if (status == 0){
        status111 = ['0', '2']
      }
      this.param = {
        ...this.param,
        regFlags: status111,
      };
      this.getData(this.param);
    },

    searchFiled(val) {
      this.param = { ...this.param, searchField: val };
    },
    //changeTable
    changeTable(current, size) {
      console.log(current, size);
      this.param = { ...this.param, pageNum: current, pageSize: size };
      this.getData(this.param);
    },
    deleteId(id) {
      this.spinning = true;
      if (id) {
        this.$api.lsDelete({ primaryIds: [id] }).then((res) => {
          this.spinning = false;
          if (res.success) {
            this.getData(this.param);
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
        });
      } else {
        this.$api.lsDelete({ primaryIds: this.ids1111 }).then((res) => {
          this.spinning = false;
          if (res.success) {
            this.getData(this.param);
            this.$message.success(res.message);
            this.ids = [];
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },
    //高级搜索
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          if((Number(values.userBarcodeStart) < Number(values.userBarcodeEnd)) || ( Number(values.primaryIdStart) < Number(values.primaryIdEnd))) {
              const param = { ...this.param, ...values };
              this.getData(param);
              this.form.resetFields();
                this.param = {
                  ...this.param,
                  craeteDateBegin: null,
                  craeteDateEnd: null,
                };
              this.visiableAdvance = false;
              this.$message.success(res.message);
          } else {
              this.$message.error("请输入正确的区间");
          }
        }
      });

    },
    handleCancel() {
      this.form.resetFields();
      this.visiableAdvance = false;
      console.log("取消");
    },





    checkOne( type, record) {  

      this.type = type;

      this.$api.xlgiao1({})
        .then((res) => {
            this.unitList=[];
            this.departmentList=[];
            this.positionList=[];
            this.facultyList=[];
            this.gradeList=[];
            this.classList=[];
            this.jobList=[];
            this.educationDegreeList=[];
            this.professionalTitleList=[];

          res.data.map((item, index) => {
          const type = item.userAttrType
          switch (type) {
            case '1':
              this.unitList.push(item)
              break;
            case '2':
              this.departmentList.push(item)
              break;
            case '3':
              this.positionList.push(item)
              break;
            case '4':
              this.facultyList.push(item)
              break;
            case '5':
              this.gradeList.push(item)
              break;
            case '6':
              this.classList.push(item)
              break;
            case '7':
              this.jobList.push(item)
              break;
            case '8':
              this.educationDegreeList.push(item)
              break;
            case '9':
              this.professionalTitleList.push(item)
              break;
            default:
              break;
          }
        })
        });

      this.$api.xlgiao2({recordTypeCode: "2"})
        .then((res) => {
          this.userTypeList=[];
            this.userTypeList = res.data;
            console.log("1", res.data)
            this.userTypeChange(res.data[0].userGroupName);
            this.modelTemp111 = res.data[0].userGroupName;
            this.userGroupName = true;
        });


      this.visiable = true

      this.type = type;
      this.record = record; 
      this.formdata.tempReaderList = [record];
      
    },
    OkCheck() {
      if(this.createDate && this.expireDate && this.zcrq ==2 && this.dqrq ==2 && this.formdata.expireDate == null && this.formdata.createDate == null ) {
        this.$message.error('请选择自定义日期');
        return false;
      }
      this.spinning = true;console.log(this.formdata);
      if(this.type == 2) {
        this.formdata.tempReaderList = this.ids2222;
      }
      this.formdata.prepayment = +this.formdata.prepayment;
      this.formdata.serviceCharge = +this.formdata.serviceCharge;
      this.formdata.deposit = +this.formdata.deposit;

      this.formdata.collegeClass = this.collegeClass ? this.formdata.collegeClass : null;
      this.formdata.collegeClassId = this.collegeClass ? this.formdata.collegeClassId : null;
      this.formdata.collegeDept = this.collegeDept ? this.formdata.collegeDept : null;
      this.formdata.collegeDeptId = this.collegeDept ? this.formdata.collegeDeptId : null;
      this.formdata.collegeYear = this.collegeYear? this.formdata.collegeYear : null;
      this.formdata.collegeYearId = this.collegeYear ? this.formdata.collegeYearId : null;
      this.formdata.createDate = this.createDate? this.formdata.createDate : null;
      this.formdata.department = this.department ? this.formdata.department : null;
      this.formdata.departmentId = this.department ? this.formdata.departmentId : null;
      this.formdata.deposit = this.deposit ? this.formdata.deposit : null;
      this.formdata.eduId = this.eduName ? this.formdata.eduId : null;
      this.formdata.eduName = this.eduName ? this.formdata.eduName : null;
      this.formdata.expireDate = this.expireDate ? this.formdata.expireDate : null;
      this.formdata.gender = this.gender ? this.formdata.gender : null;
      this.formdata.job = this.job ? this.formdata.job : null;
      this.formdata.jobId = this.job ? this.formdata.jobId : null;
      this.formdata.passwordType = this.passwordValue ? this.formdata.passwordType : null;
      this.formdata.passwordValue = this.passwordValue ? this.formdata.passwordValue : null;
      this.formdata.position = this.position ? this.formdata.position : null;
      this.formdata.positionId = this.position ? this.formdata.positionId : null;
      this.formdata.positionTitle = this.positionTitle ? this.formdata.positionTitle : null;
      this.formdata.positionTitleId = this.positionTitle ? this.formdata.positionTitleId : null;
      this.formdata.prepayment = this.prepayment ? this.formdata.prepayment : null;
      this.formdata.primaryIdUp = this.primaryIdUp ? this.formdata.primaryIdUp : null;
      this.formdata.serviceCharge = this.serviceCharge ? this.formdata.serviceCharge : null;
      this.formdata.unit = this.unit ? this.formdata.unit : null;
      this.formdata.unitId = this.unit ? this.formdata.unitId : null;
      this.formdata.userBarcode = this.userBarcode ? this.formdata.userBarcode : null;
      this.formdata.userGroupId = this.userGroupName ? this.formdata.userGroupId : null;
      this.formdata.userGroupName = this.userGroupName ? this.formdata.userGroupName : null;


      this.$api
        // .check({
          .lsZC(this.formdata)
        .then((res) => {
          this.spinning = false;
          if (res.success) {
            if(res.data.fail > 0) {
              this.visiabledownload = true;
              this.downloadTotal = res.data.total;
              this.downloadFail = res.data.fail;
              this.dpwnloadSuccess = res.data.success;
              this.failResult = res.data.failResult;
            } else {
              this.$message.success("操作成功");
            }
            
            this.getData(this.param);
            // this.$message.info(res.data);
            this.ids = [];
            this.modelTemp111 = "";
            this.modelTemp222 = "";
            this.modelTemp333 = "";
            this.modelTemp444 = "";
            this.modelTemp555 = "";
            this.modelTemp666 = "";
            this.modelTemp777 = "";
            this.modelTemp888 = "";
            this.modelTemp999 = "";
            this.modelTemp000 = "";
            this.modelTemp001 = false;
            this.zcrq = 1;
            this.dqrq = 1;
            this.formdata = {
        collegeClass: null,
        collegeClassId: null,
        collegeDept: null,
        collegeDeptId: null,
        collegeYear: null,
        collegeYearId: null,
        createDate: null,
        department: null,
        departmentId: null,
        deposit: null,
        eduId: null,
        eduName: null,
        expireDate: null,
        gender: null,
        job: null,
        jobId: null,
        passwordType: null,
        passwordValue: null,
        position: null,
        positionId: null,
        positionTitle: null,
        positionTitleId: null,
        prepayment: null,
        primaryIdUp: null,
        researcherFlag: "0",
        searchKey: "",
        serviceCharge: null,
        tempReaderList: [],
        unit: null,
        unitId: null,
        userBarcode: null,
        userGroupId: null,
        userGroupName: null,
      };

      this.collegeClass=false;
      this.collegeDept=false;
      this.collegeYear=false;
      this.createDate=false;
      this.department=false;
      this.deposit= false;
      this.eduName= false;
      this.expireDate= false;
      this.gender= false;
      this.job= false;
      this.passwordValue= false;
      this.position= false;
      this.positionTitle= false;
      this.prepayment= false;
      this.primaryIdUp= false;
      this.researcherFlag= false;
      this.searchKey= false;
      this.serviceCharge= false;
      this.tempReaderList=false;
      this.unit= false;
      this.userBarcode= false;
      this.userGroupName= false;
          } else {
            this.$message.error(res.message);
          }
        });
      this.visiable = false;
    },




    CancelCheck() {
      this.visiable = false;
    },
  },
};
</script>

<style scoped>
#app {
  padding: 20px;
}
.search {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}
.search > .label {
  display: inline-block;
  width: 80px;
  line-height: 32px;
}
.inputGroup {
  margin-left: 10px;
}
/deep/.ant-input-affix-wrapper .ant-input-suffix :not(.anticon) {
  line-height: 1.5;
  color: #1890ff;
}
.table {
  margin-top: 10px;
  padding-bottom: 50px;
  position: relative;
  z-index: 1;
}
.footer {
  padding: 0 20px;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 99;
  box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.13);
  background-color: #fff;
}

.cancelBtn {
  margin-right: 10px;
}
.statusBtn {
  text-align: right;
}
.unnormal {
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #999;
  display: inline-block;
}
.normal {
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: green;
  display: inline-block;
}
#advanceModal > div {
  margin: 4px;
}
#advanceModal > div > label {
  width: 100px;
  display: inline-block;
}
</style>
