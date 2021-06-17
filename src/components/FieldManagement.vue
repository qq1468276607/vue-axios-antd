<template>
  <div id="app">
    <div class="search">
    <div>
    <a-input-search style="width: 200px" @search="onSearch" />
    <span class="label" style="margin-left: 10px">字段属性：</span>
    <a-radio-group
        :default-value="null"
        @change="onRadioChange"
        style="line-heigth: 32px; margin-top: 5px"
    >
        <a-radio :value="null"> 全部 </a-radio>
        <a-radio :value="1"> 基础字段 </a-radio>
        <a-radio :value="2"> 扩展字段 </a-radio>
    </a-radio-group>
    </div>  
    <div>
    <a-button @click="openModel">新增字段</a-button>
    </div>        
    </div>
    <div class="table">
      <a-table
        :columns="columns"
        :data-source="tableData || []"
        :pagination="false"
        :rowKey="(record, index) => record.id"
        bordered
        :scroll="{
            x: windowWidth,
            y: windowHeight,
        }"
      >
        <span slot="index" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="type" slot-scope="text">
          <span v-if="text == 1">基础字段</span>
          <span v-if="text == 2">扩展字段</span>
        </span>
        <span slot="isRequire" slot-scope="text, record, index">
          <span v-if="text == 2"><a-switch :checked='true' disabled /></span>
          <span v-else><a-switch :default-checked ='text == 1' @change="requireChange(record)" /></span>
          <!-- <span v-if="text == 0">不必填</span>
          <span v-if="text == 1">需要必填</span>
          <span v-if="text == 2">需要必填且不可关闭必填</span> -->
        </span>
        <span slot="isShow" slot-scope="text, record, index">
          <span v-if="(record.type == 1 && record.isRequire == 2) || record.isRequire == 1 "><a-switch :checked='true' disabled /></span>
          <span v-else><a-switch :default-checked='text == 0' @change="isShowChange(record)" :key="text == 0" /></span>
          <!-- <span v-if="text == 0">展示</span>
          <span v-if="text == 1">不展示</span> -->
        </span>
        <span slot="action" slot-scope="text, record">
            <a-popconfirm
                title="是否确定删除"
                ok-text="是"
                cancel-text="否"
                @confirm="confirm(record.id)"
                @cancel="this.visiable=false"
            >
                <a>删除</a>
            </a-popconfirm>  
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
        <!-- <a-button style="margin-left: 12px" >删除</a-button> -->
        <a-button style="margin-left: 12px" @click="exportData">导出</a-button
        >
      </div>
    </div>
    <a-modal
      title="新增扩展字段"
      :visible="visible"
      @ok="handleSearch"
      @cancel="()=>this.visible = false"
      ok-text="确认" 
      cancel-text="取消"
      destroyOnClose 
    >
       <a-form class="ant-advanced-search-form" :form="form">
           <a-form-item label="字段名称" :label-col="labelCol" :wrapper-col="wrapperCol" >
            <a-input v-decorator="[ 'name',{ rules: [{required: true,message: '请输入!',},], },]" placeholder="请输入" />
          </a-form-item>
          <a-form-item label="字段属性" :label-col="labelCol" :wrapper-col="wrapperCol" >
            <a-input disabled v-decorator="[ 'sx',{ rules: [{required: false,message: '请输入!',},], initialValue: '扩展字段' },]" placeholder="请输入" />
          </a-form-item>
          <a-form-item label="是否必填" :label-col="labelCol" :wrapper-col="wrapperCol" >
            <a-switch v-decorator="[ 'isRequire',{ rules: [{required: false,message: '请输入!',},],},]" />
          </a-form-item>
          <a-form-item label="是否展示" :label-col="labelCol" :wrapper-col="wrapperCol" >
            <a-switch v-decorator="[ 'isShow',{ rules: [{required: false,message: '请输入!',},],},]" />
          </a-form-item>
       </a-form>
    </a-modal>
  </div>
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
    title: "字段名称",
    dataIndex: "name",
    key: "name",
    width: 220,
  },
  {
    title: "字段属性",
    dataIndex: "type",
    key: "type",
    scopedSlots: { customRender: "type" },
    width: 80,
  },
  {
    title: "是否必填",
    dataIndex: "isRequire",
    key: "isRequire",
    scopedSlots: { customRender: "isRequire" },
    width: 80,
  },
  {
    title: "是否展示",
    dataIndex: "isShow",
    key: "isShow",
    scopedSlots: { customRender: "isShow" },
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
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      labelCol2: { span: 2 },
      wrapperCol2: { span: 21 },
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      searchParams: {
        fid: this.getCookie("fid") ? this.getCookie("fid") : '' ,  
        type: null,
        fieldName: null,
        page: 1,
        rows: 10,
      },
      columns,
      tableData: [],
      totalNum: null,
      visible: false,
      windowWidth: window.innerWidth, //实时屏幕宽度
      windowHeight: window.innerHeight - 220, //实时屏幕高度
    };
  },

  created() {
    this.getData({
        fid: this.getCookie("fid") ? this.getCookie("fid") : '' ,  
        type: null,
        fieldName: null,
        page: 1,
        rows: 10,
    });
  },
  components: { Pagenation },
  methods: {
   //获取cookie
    getCookie(name){
        var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
        if(arr != null) return unescape(arr[2]); 
        return false;
    },
    getData(searchParams) {
      this.$api.getFieldList(searchParams).then((res) => {
        const response = res;
        if (response.success) {
          this.tableData = response.data.fieldList;
          this.totalNum = response.data.totalNum;
        } else {
          this.$message.error(response.message);
        }
      });
    },
    onRadioChange(e) {
     this.searchParams.type = e.target.value;
     this.getData(this.searchParams);
    },
    onSearch(value) {
     this.searchParams.fieldName = value;
     this.getData(this.searchParams);
    },
    changeTable(page, rows) {
      this.searchParams.page = page;
      this.searchParams.rows = rows;
      this.getData(this.searchParams);
    },
    openModel() {
      this.visible = true;
    },
    handleSearch(e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
        if (error === null) {
            const params = {
               fid: this.getCookie("fid") ? this.getCookie("fid") : '' ,  
               name: values.name,
               isRequire: values.isRequire ? 1 : 0,//是否必填 0不需必填 1需要必填 2需要必填且不可关闭必填
               isShow:  values.isShow ? 0 : 1 //是否展示 0展示 1不展示
            }
            this.$api.insert(params).then((res) => {
                const response = res;
                if (response.success) {
                  this.$message.success(response.message);
                  this.visible = false;
                  this.getData(this.searchParams);
                } else {
                  this.$message.error(response.message);
                }
            });
        }
      });
    },
    confirm(id) {
        this.$api.deleteField({id}).then((res) => {
            const response = res;
            if (response.success) {
                this.$message.success(response.message);
                this.getData(this.searchParams);
            } else {
                this.$message.error(response.message);
            }
        });
    },
    exportData() {
        this.$api.exportField({
            type: this.searchParams.type,
            fieldName: this.searchParams.fieldName,
            fid: this.getCookie("fid") ? this.getCookie("fid") : '' ,  
        }).then((res) => {
            const response = res;
            if (response.success) {
              window,open(response.data)
            } else {
                this.$message.error(response.message);
            }
        });
    },
    updateField(params) {
        this.$api.updateField(params).then((res) => {
            const response = res;
            if (response.success) {
               this.$message.success(response.message);
               this.getData(this.searchParams);
            } else {
              this.$message.error(response.message);
            }
        });
    },
    requireChange(record) {
      const params = {
        id:record.id,
        isRequire: record.isRequire == 1 ? 0 : 1,
        isShow: record.isRequire == 0 ? 0 : record.isShow,  // 如果是必填情况 也必须展示
      }
      this.updateField(params)
    },
    isShowChange(record) {
      const params = {
        id:record.id,
        isRequire: record.isRequire,
        isShow: record.isShow == 0 ? 1 : 0,
      }
      this.updateField(params)
    }
  },
}
</script>

<style scoped>
#app {
  padding: 20px;
}
.search {
  display: flex;
  justify-content: space-between;
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
/deep/ .ant-form-item {
  margin-bottom: 10px;
}
.table {
  margin-top: 10px;
  padding-bottom: 50px;
  overflow: auto;
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
