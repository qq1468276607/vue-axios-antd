<template>
  <div id="department">
    <a-spin :spinning="spinning">
      <div class="search">
        <a-button @click="showDepartModal('add', {})"> 新增院系 </a-button>
        <a-modal
          v-model="visibleDepart"
          :title="title + '院系'"
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
            <a-form-item label="院系名称">
              <a-input
                v-decorator="[
                  'userAttrName',
                  {
                    initialValue: userAttrName || null,
                    rules: [{ required: true, message: '请输入院系名称' }],
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
                    initialValue: isOpen,
                  },
                ]"
              />
            </a-form-item>

            <a-form-item label="简介">
              <a-textarea
                v-decorator="[
                  'description',
                  { initialValue: description || null },
                ]"
                placeholder="请输入"
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-item>

            <!-- <a-form-item
            :wrapper-col="{ span: 12, offset: 10 }"
            style="text-align: right"
          >
            <a-button
              @click="() => (this.visibleDepart = false)"
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
          
          :pagination="false"
          :rowKey="(record, index) => record.id"
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
              v-if="text === 1"
              default-checked
              @change="() => onSwitch('0', record)"
            />
            <a-switch
              v-if="text === 0"
              @change="() => onSwitch('1', record)"
            />
          </span>
          <span slot="action" slot-scope="text">
            <a @click="() => showDepartModal('edit', text)">编辑</a>
            <a style="margin-left: 12px" @click="deleteId(text.cdId)">删除</a>
          </span>
        </a-table>
        <Pagenation
          v-bind:page="page"
          v-bind:pageSize="pageSize"
          v-bind:selectOption="[10, 20, 50, 100]"
          v-bind:totle="total"
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
    width: 65,
    align: "center",
    scopedSlots: { customRender: "index" },
  },
  {
    title: "院系名称",
    dataIndex: "cdName",
    key: "cdName",
  },
  {
    title: "是否启用",
    key: "openFlag",
    dataIndex: "openFlag",
    scopedSlots: { customRender: "switch" },
  },
  {
    title: "简介",
    dataIndex: "remark",
    key: "remark",
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];

const data = [
  // { userAttrName: "11", isOpen: "1", description: "111", id: 1 },
  // { userAttrName: "22", isOpen: "1", description: "222", id: 2 },
  // { userAttrName: "33", isOpen: "1", description: "333", id: 3 },
];
import Pagenation from "../Pagenation/index.vue";
import qs from "qs"; //序列化数据请求
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
      description: null,
      ids: [], //删除id
      spinning: false,
      fid: this.getCookie("fid") ? this.getCookie("fid") : "",
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
      // userAttrType: "2", //类型 1读者类型 2院系 3专业 4班级
      // isOpen: null, //是否启用 0不启用 1启用 全部传null
      page: 1,
      rows: 10,
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
      // this.$api.getUserAttrList(param).then((res) => {

      this.$api.yxlist(param).then((res) => {
        if (res.success) {
          this.data = res.data.list || [];
          this.total = res.data.total || 0;
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

        .yxUpdata({
          cdId: record.cdId,
          cdName: record.cdName,
          openFlag: text,
          remark: record.remark,
        })
        .then((res) => {
          if (res.success) {
            this.getData({
              // fid: this.fid,
              // userAttrType: "2", //类型 1读者类型 2院系 3专业 4班级
              // isOpen: null, //是否启用 0不启用 1启用 全部传null
              page: this.page,
              rows: this.pageSize,
            });
          } else {
            this.$message.error(res.message);
          }
        });
    },
    //modalform
    showDepartModal(type, param) {
      if (type === "add") {
        this.title = "新增";
      } else {
        this.title = "编辑";
        this.id = param.cdId;
        this.userAttrName = param.cdName;
        this.isOpen = (param.openFlag == 0 ? false : true);
        this.description = param.remark;
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
              .xyAdd({
                // fid: this.fid,
                // userAttrType: "2", //属性类别 1读者类型 2院系 3专业 4班级
                cdName: values.userAttrName, //属性名称
                openFlag: values.isOpen ? "1" : "0", //是否启用 0不启用 1启用
                remark: values.description, //描述 类型为班级时为入学年份
              })
              .then((res) => {
                if (res.success) {
                  this.getData({
                    // fid: this.fid,
                    // userAttrType: "2", //类型 1读者类型 2院系 3专业 4班级
                    // isOpen: null, //是否启用 0不启用 1启用 全部传null
                    page: this.page,
                    rows: this.pageSize,
                  });
                  this.$message.success(res.message);
                } else {
                  this.$message.error(res.message);
                }
              });
          } else {
            this.data = [];
            this.$api
              // .updateItem({
                .yxUpdata({
                cdId: this.id,
                cdName: values.userAttrName,
                openFlag: values.isOpen ? "1" : "0",
                remark: values.description,
              })
              .then((res) => {
                if (res.success) {
                  this.getData({
                    // fid: this.fid,
                    // userAttrType: "2", //类型 1读者类型 2院系 3专业 4班级
                    // isOpen: null, //是否启用 0不启用 1启用 全部传null
                    page: this.page,
                    rows: this.pageSize,
                  });
                  this.$message.success(res.message);
                } else {
                  this.$message.error(res.message);
                }
              });
          }
          this.form.resetFields();
          this.visibleDepart = false;
        }
      });
    },
    handleCancel() {
      this.form.resetFields();
      this.id = null;
      this.userAttrName = null;
      this.isOpen = null;
      this.description = null;
      this.visibleDepart = false;
    },
    //changeTable
    changeTable(current, size) {
      console.log(current, size);
      this.page = current;
      this.pageSize = size;
      this.getData({
        // fid: this.fid,
        // userAttrType: "2", //类型 1读者类型 2院系 3专业 4班级
        // isOpen: null, //是否启用 0不启用 1启用 全部传null
        page: this.page,
        rows: this.pageSize,
      });
    },
    //删除
    deleteId(id) {
      // this.$api.deleteItem({ ids: this.ids }).then((res) => {
        this.$api.xyDelete({cdId: id}).then((res) => {
        if (res.success) {
          this.getData({
            // fid: this.fid,
            // userAttrType: "2", //类型 1读者类型 2院系 3专业 4班级
            // isOpen: null, //是否启用 0不启用 1启用 全部传null
            page: this.page,
            rows: this.pageSize,
          });
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    exportId() {
      this.spinning = true;
      this.$api
        .exportItem({
          fid: this.fid,
          userAttrType: "2",
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
