<template>
  <a-spin :spinning="spinning">
    <div id="app">  
       <div>
          <h3 class="title">权限详情</h3>
       </div>
       <div>
         <a-form class="ant-advanced-search-form" :form="form">
          <a-row :gutter="24" class="top">
            <a-col span="6">
              <a-form-item label="角色名称" :label-col="labelCol" :wrapper-col="wrapperCol" >
                <a-input v-decorator="[ 'roleName',{ rules: [{required: true,message: '请输入!',},], initialValue: record.roleName || undefined },]" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col span="18">
              <a-form-item label="角色说明" :label-col="labelCol" :wrapper-col="wrapperCol" >
                <a-input v-decorator="[ 'remark',{ rules: [{required: false,message: '请输入!',},], initialValue: record.remark || undefined },]" placeholder="请输入" />
              </a-form-item>
            </a-col>
          </a-row>
         </a-form>
       </div>
        <div>
          <h3 class="title">菜单权限</h3>
        </div>
        <div class="contont">  
          <div class="contontLeft">
             <div class="leftRow" :style="{ 'backgroundColor': activeKey == i ? '#E7F5FF' : '#fff' }"  v-for="(item, i) in data" :key="i" @click="clickRow(i)">
                <span @click="e => e.stopPropagation()">
                  <a-checkbox @change="(e) => onChangeBox(e.target.checked, i)" :checked ="checked(i)"/>
                </span>&nbsp; {{item.name}}
            </div>
          </div>
          <div class="contontRight">
            <table style="width: 100%">
              <thead style="backgroundColor: #D9E5F1"><tr><th style="width: 15%," class="thRow">二级菜单权限</th><th style="width: 35%" class="thRow">三级菜单权限</th><th style="width: 50%" class="thRow">功能权限</th></tr></thead>
              <tbody>  
                <tr v-for="(item, index) in childData" :key="index" v-show="(item.child || []).length + (item.function || []).length !== 0">
                    <td class="tdRow" style="width: 15%">
                      <a-checkbox @change="(e) => onChangeContOne(e.target.checked, index)" :checked="(curTrData[index].choosedNos.length) + (curTrData[index].choosedFANos.length) > 0" />
                        {{item.name}}
                      </td>
                    <td class="tdRow" style="width: 35%">
                        <span v-for="(row, idx) in item.child" :key="idx" class="san">
                          <a-checkbox @change="(e) => onChangeContTwo(e.target.checked, item.child[idx], index)" :checked="(curTrData[index].choosedNos || []).findIndex(info => info.authNo === item.child[idx].authNo) > -1" /> {{row.name}}
                        </span>
                    </td>
                    <td class="tdRow" style="width: 50%" >
                        <span v-for="(row2, idx2) in item.function" :key="idx2" class="san">
                          <a-checkbox @change="(e) => onChangeContThree(e.target.checked, item.function[idx2], index)" :checked="(curTrData[index].choosedFANos || []).findIndex(info => info.authNo === item.function[idx2].authNo) > -1"  /> {{row2.authName}} &nbsp; （{{row2.authName}}）
                        </span>
                    </td>
                </tr>
              </tbody>
            </table>
          </div>
       </div>
        <div class="footer">
        <div>
          <a-button style="margin-left: 12px" @click="back" >返回</a-button>
          <a-button style="margin-left: 12px" @click="submit" >确定</a-button>
        </div>
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
      wrapperCol: { span: 18 },
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      searchParams: {
        fid: this.getCookie("fid") ? this.getCookie("fid") : '' ,  
        page: 1,
        rows: 10,
      },
      windowWidth: window.innerWidth, //实时屏幕宽度
      windowHeight: window.innerHeight - 220, //实时屏幕高度
      spinning: false,
      data: [],
      editData: {},
      formType: '',
      childData: {},


      choosedNos: [],
      choosedFANos: [],
      selectObj: {},
      selectFunObj: {},
      curTableTr: {},


      selectList: {},
      activeKey: 0,
      curTrData2: {},
      curTrData3: {},
    };
  },

  created() {
    this.record = this.$route.query.record || {};
    this.formType = this.$route.query.formType || {};
    this.getAllRole();
  },
  components: { Pagenation },
  props:['record'],
  methods: {
   //获取cookie
    getCookie(name){
        var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
        if(arr != null) return unescape(arr[2]); 
        return false;
    },
    checked(i) {
      const a = this.selectList[i];
      let check = false;
      a.map(item => {
        if ((item.choosedFANos.length) + (item.choosedNos.length) > 0) {
          check = true;
        }      
      })
      return check;    
    },
    getAllRole() {
    if (this.formType === 'updata') {
        this.$api.getAllRole().then((res)=>{
        this.spinning = true;
        const result = res
        if(result.success) {
          this.spinning = false;
          this.data = result.data;
          this.getEditRoleData();
        } else {
        this.$message.error(result.message);
        }
      });
    } else {
        this.$api.getAllRole().then((res)=>{
        this.spinning = true;
        const result = res
        if(result.success) {
          this.spinning = false;
          this.data = result.data;
          this.getChoosedList();
        } else {
        this.$message.error(result.message);
        }
      });
    }
    },

    getEditRoleData() {
     this.$api.getEditRoleData({roleId: this.record.roleId}).then((res)=>{
      this.spinning = true;
      const result = res
      if(result.success) {
        this.spinning = false;
        this.editData = result.data;
        this.getChoosedList();
      } else {
      this.$message.error(result.message);
      }
    });
    },

    getChoosedList() {
      const authNos = this.editData.authNos ? this.editData.authNos : [];  // 当前角色下所有被选中的菜单
      const functionAuthNos = this.editData.functionAuthNos ? this.editData.functionAuthNos : [];  // 当前角色下所有被选中的功能权限
      const selectList = {};
      this.data.map((curFirst, Index) => {
        const child = curFirst.child ? curFirst.child: [];
        const list = [];
        child.map((item) => {
          const choosedNos = [];   // 当前选中的一级菜单下选中的菜单
          const choosedFANos = [];  // 当前选中的一级菜单下选中的功能权限菜单
          const san = item.child ? item.child : []
          const FAN = item.function ? item.function : []
          san.map((info) => {
            if (authNos.indexOf(info.authNo) > -1)choosedNos.push(info);
          });
          FAN.map((info) => {
            if (functionAuthNos.indexOf(info.authNo) > -1)choosedFANos.push(info);
          });
          list.push({ authNo: item.authNo, choosedNos, choosedFANos });
        });
        selectList[Index] = list;
      });
      this.selectList = selectList;
      this.clickRow(0);
    },
    clickRow(i) {
      this.activeKey = i;
      this.childData = (this.data[i] || {}).child || [];
      const curData = this.selectList[this.activeKey] || [];
      this.curTrData = curData;
    },
    onChangeBox(flag, idx) {
    this.clickRow(idx);
    const curFirst =  this.data[idx] || {};
    const child = curFirst.child ? curFirst.child : [];
    const list = [];
    child.map((item) => {
      const choosedNos = [];   // 当前选中的一级菜单下选中的菜单
      const choosedFANos = [];  // 当前选中的一级菜单下选中的功能权限菜单
      const san = item.child ? item.child : [];
      const FAN = item.function ? item.function : []
      san.map((info) => { if (flag)choosedNos.push(info); });
      FAN.map((info) => { if (flag)choosedFANos.push(info); });
      list.push({ authNo: item.authNo, choosedNos, choosedFANos });
    });
      this.selectList[idx] = list;
      child.map((item, i) => {
        this.curTrData[i].choosedNos = this.selectList[idx][i].choosedNos;
        this.curTrData[i].choosedFANos = this.selectList[idx][i].choosedFANos;
      })

    },

    onChangeContOne(flag, Index) {
      const curData = this.selectList[this.activeKey] || [];
      const curTrData = curData[Index] || {};
      const choosedNos = [];
      const choosedFANos = [];
      if (flag) {
        const tableData = (this.data[this.activeKey] || {}).child || [];
        const curTableTr = tableData[Index] || {};
        (curTableTr.child || []).map(item => choosedNos.push(item));
        (curTableTr.function || []).map(item => choosedFANos.push(item));
      }
      this.curTrData[Index].choosedNos = choosedNos;
      this.curTrData[Index].choosedFANos = choosedFANos;
    },
    onChangeContTwo(flag, item, Index,) {
      const curData = this.selectList[this.activeKey] || [];
      const curTrData = curData[Index] || {};
      const choosedNos = curTrData.choosedNos || [];
      if (flag) {  // 添加
        choosedNos.push(item);
      } else {  // 去除
        const index = choosedNos.findIndex(info => info.authNo === item.authNo);
        choosedNos.splice(index, 1);
      }
      this.curTrData = curData;
    },

    onChangeContThree(flag, item, Index) {
      const curData = this.selectList[this.activeKey] || [];
      const curTrData = curData[Index] || {};
      const choosedFANos = curTrData.choosedFANos || [];
      if (flag) {  // 添加
        choosedFANos.push(item);
      } else {  // 去除
        const index = choosedFANos.findIndex(info => info.authNo === item.authNo);
        choosedFANos.splice(index, 1);
      }
       this.curTrData = curData;
    },

    back() {
      window.location.href="javascript:history.go(-1)"
    },
    submit() {
      const authNos = [];
      const functionAuthNos = [];
      for (const key in this.selectList) {
        const list = this.selectList[key] || [];
        list.map((item) => {
          (item.choosedNos || []).map(info => info.authNo && authNos.push(info.authNo));
          (item.choosedFANos || []).map(info => info.authNo && functionAuthNos.push(info.authNo));
        });
      }
        this.form.validateFields((error, values) => {
        if (error === null) {
            const params = {
              ...values,
              authNos,
              functionAuthNos,
            }
            //  updateRole addRole
            if(this.formType == 'updata') {
              this.$api.updateRole({roleId: this.record.roleId, ...params}).then((res)=>{
                this.spinning = true;
                const result = res
                if(result.success) {
                  this.spinning = false;
                  this.$message.success(result.message);
                  this.back();
                } else {
                  this.$message.error(result.message);
                }
              });
            } else {
              this.$api.addRole({ ...params }).then((res)=>{
                this.spinning = true;
                const result = res
                if(result.success) {
                  this.spinning = false;
                  this.$message.success(result.message);
                  this.back();
                } else {
                  this.$message.error(result.message);
                }
              });
            }
        }
      });
    }
  },
}
</script>

<style scoped>
#app {
  padding: 20px;
}
.title{
    font-weight: bold;
}
.contont{
  display: flex;
  padding-bottom: 50px;
}
.contontLeft{
  width: 250px;
  height: 100%;
  border: 2px solid #E9EEF5;
}
.contontRight{
  flex: 1;
  margin-left: 20px;
  height: 100%;
  border: 2px solid #E9EEF5;
}
.leftRow{
 cursor: pointer;
 height: 40px;
 line-height: 40px;
 padding: 0 20px;
}
.thRow{
  text-align: center;
}
.tdRow{
  text-align: left;
  padding: 0 20px;
  border-right: 1px solid #f5f3f3;
}
thead{
  background: #f5f3f3;
  height: 30px;
  line-height: 30px;
  color: #808080;
  font-weight: bold;
}
th{
  text-align: center;
}
tr{
  border-bottom: 1px solid #f5f3f3;
}
.san{
  display: inline-block;
  width: 50%;
  padding: 5px 0;
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
