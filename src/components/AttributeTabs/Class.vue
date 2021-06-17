<template>
  <div id="class">
    <a-spin :spinning="spinning">
      <div class="search">
        <a-button @click="showDepartModal('add', {})"> 新增班级 </a-button>
        <a-modal
          v-model="visibleDepart"
          :title="title + '班级'"
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
            <a-form-item label="班级名称">
              <a-input
                v-decorator="[
                  'userAttrName',
                  {
                    initialValue: userAttrName || null,
                    rules: [{ required: true, message: '请输入班级名称' }],
                  },
                ]"
                placeholder="请输入"
              />
            </a-form-item>
            <a-form-item label="是否启用">
              <a-switch
                v-decorator="[
                  'isOpen',
                  {
                    valuePropName: 'checked',
                    initialValue: isOpen == 1 ? true : false,
                  },
                ]"
              />
            </a-form-item>

            <a-form-item label="入学年份：">
              <a-date-picker
                mode="year"
                format="YYYY"
                :open="yearShowOne"
                :value="year"
                @openChange="openChangeOne"
                @panelChange="panelChangeOne"
                :allowClear="false"
                placeholder="请选择"
              />
            </a-form-item>

            <!-- <a-form-item
            :wrapper-col="{ span: 12, offset: 10 }"
            style="text-align: right"
          >
            <a-button
              @click="
                () => {
                  this.visibleDepart = false;
                  this.yearShowOne = false;
                  this.$form.createForm(this, {});
                }
              "
              class="cancelBtn"
            >
              取消
            </a-button>
            <a-button type="primary" html-type="submit"> 确定 </a-button>
          </a-form-item> -->
          </a-form>
        </a-modal>
      </div>
      <div class="table">
        <a-table
          :columns="columns"
          :data-source="data"
          
          :rowKey="(record, index) => record.id"
          :pagination="false"
          :scroll="{
            x: windowWidth,
            y: windowHeight - 20,
          }"
          bordered
        >
          <span slot="index" slot-scope="text, record, index">
            {{ (page - 1) * pageSize + index + 1 }}
          </span>
          <span slot="switch" slot-scope="text, record">
            <a-switch
              v-if="text == 1"
              default-checked
              @change="() => onSwitch('0', record)"
            />
            <a-switch
              v-if="text == 0"
              @change="() => onSwitch('1', record)"
            />
          </span>
          <span slot="action" slot-scope="text">
            <a @click="() => showDepartModal('edit', text)">编辑</a>
            <a style="margin-left: 12px" @click="deleteId(text.userAttrId)">删除</a>
          </span>
        </a-table>
        <Pagenation
          :page="page"
          :pageSize="pageSize"
          :selectOption="[10, 20, 50, 100]"
          :totle="total"
          @changeTable="changeTable"
        />
      </div>
      <!-- <div class="footer">
        <div>
        <a-checkbox :default-checked="false" />
        <a-dropdown placement="topCenter">
          <a class="ant-dropdown-link">全选所有页</a>
          <a-menu slot="overlay">
            <a-menu-item @click="changeIsAll(1)"> 全选所有页 </a-menu-item>
            <a-menu-item @click="changeIsAll(2)"> 全选当前页 </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
        <div>
          <a-button style="margin-left: 12px" @click="deleteId">删除</a-button>
          <a-button style="margin-left: 12px" @click="exportId">导出</a-button>
        </div>
      </div> -->
    </a-spin>
  </div>
</template>


<script>
const columns = [
  {
    title: "序号",
    width: 50,
    scopedSlots: { customRender: "index" },
  },
  {
    title: "班级名称",
    dataIndex: "userAttrName",
    key: "userAttrName",
  },
  {
    title: "入学年份",
    dataIndex: "remark",
    key: "remark",
  },
  {
    title: "启用",
    key: "openFlag",
    dataIndex: "openFlag",
    scopedSlots: { customRender: "switch" },
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];
const data = [];
import Pagenation from "../Pagenation/index.vue";
import moment from "moment";
export default {
  data() {
    return {
      windowWidth: window.innerWidth, //实时屏幕宽度
      windowHeight: window.innerHeight - 280, //实时屏幕高度
      visibleDepart: false,
      data,
      total: 0,
      columns,
      page: 1,
      pageSize: 10,
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" }),
      title: "新增",
      id: null,
      userAttrName: null,
      isOpen: "0",
      yearShowOne: false,
      year: "",
      ids: [],
      spinning: false, //加载
      fid: this.getCookie("fid") ? this.getCookie("fid") : "",
      moment,
    };
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.ids = selectedRowKeys;
        },
        selectedRowKeys: this.ids,
      };
    },
  },
  created() {
    this.getData({
      // fid: this.fid,
      // userAttrType: "4", //类型 1读者类型 2院系 3专业 4班级
      // isOpen: null, //是否启用 0不启用 1启用 全部传null
      pageNum: 1,
      pageSize: 10,
      "userAttrType":6 //固定
    });
  },
  components: { Pagenation },
  methods: {
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
    getData(param) {
      this.spinning = true;
      this.$api.bjlist(param).then((res) => {
        this.spinning = false;
        if (res.success) {
          this.data = res.data.result || [];
          this.total = res.data.totalCount || 0;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    isShowFilter() {
      this.filterShow = !this.filterShow;
    },
    changeIsAll(val) {
      console.log(val);
    },
    onSwitch(text, record) {
      this.$api
        // .updateItem({
          .bjUpdate({
          userAttrId: record.userAttrId,
          userAttrName: record.userAttrName,
          openFlag: text,
          remark: record.remark,
        })
        .then((res) => {
          if (res.success) {
            this.getData({
              // fid: this.fid,
              // userAttrType: "4", //类型 1读者类型 2院系 3专业 4班级
              // isOpen: null, //是否启用 0不启用 1启用 全部传null
              pageNum: this.page,
              pageSize: this.pageSize,
              "userAttrType":6 //固定
            });
          } else {
            this.$message.error(res.message);
          }
        });
      console.log("switch", text, record);
    },
    //modalform
    showDepartModal(type, param) {
      if (type === "add") {
        this.title = "新增";
      } else {
        this.title = "编辑";
        this.id = param.userAttrId;
        this.userAttrName = param.userAttrName;
        this.isOpen = param.openFlag;
        this.year = param.remark;
      }
      console.log(type, param);
      this.visibleDepart = true;
    },
    //modal
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.title === "新增") {
            this.$api
              // .addItem({
                .bjAdd({
                // fid: this.fid,
                // userAttrType: "4", //属性类别 1读者类型 2院系 3专业 4班级
                userAttrName: values.userAttrName, //属性名称
                userAttrType:6, //固定
                openFlag: values.isOpen ? "1" : "0", //是否启用 0不启用 1启用
                remark: this.year, //描述 类型为班级时为入学年份
              })
              .then((res) => {
                if (res.success) {
                  this.$message.success(res.message);
                  this.getData({
                    // fid: this.fid,
                    // userAttrType: "4", //类型 1读者类型 2院系 3专业 4班级
                    // isOpen: null, //是否启用 0不启用 1启用 全部传null
                    pageNum: this.page,
                    pageSize: this.pageSize,
                    "userAttrType":6 //固定
                  });
                } else {
                  this.$message.error(res.message);
                }
              });
          } else {
            this.data = [];
            this.$api
              // .updateItem({
                .bjUpdate({
                userAttrId: this.id,
                userAttrName: values.userAttrName,
                openFlag: values.isOpen ? "1" : "0",
                remark: this.year,
              })
              .then((res) => {
                if (res.success) {
                  this.getData({
                    // fid: this.fid,
                    // userAttrType: "4", //类型 1读者类型 2院系 3专业 4班级
                    // isOpen: null, //是否启用 0不启用 1启用 全部传null
                    pageNum: this.page,
                    pageSize: this.pageSize,
                    "userAttrType":6 //固定
                  });
                  this.$message.success(res.message);
                } else {
                  this.$message.error(res.message);
                }
              });
          }
          this.form.resetFields();
          this.year = "2020";
          this.visibleDepart = false;
        }
      });
    },
    handleCancel() {
      this.form.resetFields();
      this.id = null;
      this.year = "2020";
      this.userAttrName = null;
      this.isOpen = null;
      this.visibleDepart = false;
    },
    //changeTable
    changeTable(current, size) {
      console.log(current, size);
      this.page = current;
      this.pageSize = size;
      this.getData({
        // fid: this.fid,
        // userAttrType: "4", //类型 1读者类型 2院系 3专业 4班级
        // isOpen: null, //是否启用 0不启用 1启用 全部传null
        pageNum: this.page,
        pageSize: this.pageSize,
        "userAttrType":6 //固定
      });
    },

    //yearpick
    openChangeOne(status) {
      //status是打开或关闭的状态
      if (status) {
        this.yearShowOne = true;
      }
    },
    // 得到年份选择器的值
    panelChangeOne(value) {
      console.log(moment(value).format("YYYY"));
      this.year = moment(value).format("YYYY");
      this.yearShowOne = false;
    },
    //删除
    deleteId(id) {
      this.spinning = true;
      // this.$api.deleteItem({ ids: this.ids }).then((res) => {
        this.$api.bjDelete({userAttrId: id}).then((res) => {
        this.spinning = false;
        if (res.success) {
          this.getData({
            // fid: this.fid,
            // userAttrType: "4", //类型 1读者类型 2院系 3专业 4班级
            // isOpen: null, //是否启用 0不启用 1启用 全部传null
            "userAttrType":6, //固定
            pageNum: this.page,
            pageSize: this.pageSize,
          });
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //导出
    exportId() {
      this.spinning = true;
      this.$api
        .exportItem({
          fid: this.fid,
          userAttrType: "4",
          isOpen: null,
        })
        .then((res) => {
          this.spinning = false;
          if (res.success) {
            window.open(res.data);
          } else {
            this.$message.error(res.message);
          }
        });
    },
  },
};
</script>

<style scoped>
.search {
  display: flex;
  justify-content: flex-end;
}
/* /deep/ .ant-select-selection--single{
   height: 28px;
 } */
.filter {
  display: inline-block;
  vertical-align: text-top;
  margin-left: 8px;
  width: 87px;
  height: 32px;
  line-height: 32px;
  cursor: pointer;
}
.filter:hover {
  background-color: #d8e5f0;
}
.select {
  width: 100%;
  display: flex;
  margin-top: 20px;
  background-color: #f9fbfd;
  height: 40px;
  line-height: 40px;
}
.selectType {
  width: 25%;
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
  background-color: #fff;
  box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.13);
}

.cancelBtn {
  margin-right: 10px;
}
</style>
