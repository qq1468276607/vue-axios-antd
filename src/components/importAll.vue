<template>
  <a-spin :spinning="spinning">
  <div id="MainContainer">
      <div class="header">
        <div class="headerLeft">
          <a-steps :current="current">
            <a-step key="1" />
            <a-step key="2" />
            <a-step key="3" />
          </a-steps>
        </div>
        <div class="headerRight">
          <a-button v-if="current < 3" type="primary" @click="next">下一步</a-button>
          <a-button v-if="current == 3" type="primary" @click="$message.success('Processing complete!')">完成</a-button>
          <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">上一步</a-button>
        </div>
      </div>
      <div class="cont">
         <div v-show="current == 0" class="contOne">
           <h3>读者导入</h3>
           <div class="oneInput">
             <div class="oneInputLeft"><span class="xing">*</span>&nbsp;&nbsp;导入包号</div>
             <div class="oneInputRight"><a-input style="width: 200px" placeholder="请输入" :value="inputVlaue" @change="changeInput"/></div>        
           </div>
           <div class="oneInput">
             <div class="oneInputLeft"><span class="xing">*</span>&nbsp;&nbsp;选择文件</div>
             <div class="oneInputRight">
               <a-upload class="upload" 
                name="file"
                :multiple="true"
                action="api/uc/uploadFile/upload"
                :headers="headers"
                :data = "{bucketName: 'libstar-userinfo'}"
                @change="handleChange"
                >
                <a-button style="width: 200px"><a-icon type="upload" />上传文件</a-button>
              </a-upload>
             </div>        
           </div>
           <div class="oneInput">
             <div class="oneInputLeft">&nbsp;&nbsp;&nbsp;下载模板</div>
             <div class="oneInputRight"><a-button style="width: 200px" @click="down()"><a-icon type="download" />下载模板</a-button></div>        
           </div>
           <div class="tip">
             <p>提示：</p>
             <p>1.导入文件必须是EXCEL文件，且EXCEL文件首行必须展示表头</p>
             <p>2.导入文件的每列的格式必须是文本格式 (日期除外),日期列请设置单元格格式为日期类型，如:2001-03-01</p>
             <p>3.导入文件中,读者是男性则性别栏填写为：男，如果是女性则性别栏填写为：女</p>
           </div>
         </div>
         <div v-show="current == 1" class="contTow">
           <div class="contTowTtile">
             <h3>默认字段设置</h3><span>（映射字段中取不到数据对应的实际数值时，将带入默认字段的值）</span>
           </div>
           <div class="oneInput">
             <div class="oneInputLeft">生效日期</div>
             <div class="oneInputRight">
               <a-date-picker style="width: 200px" :locale="locale" :default-value="importParam.effectiveDate" @change="(val) => onChangeTwoInput('picker', val)" />
             </div>        
           </div>
           <div class="oneInput">
             <div class="oneInputLeft">用户类别</div>
             <div class="oneInputRight">
               <a-select placeholder="请选择" style="width: 200px"  :value="importParam.userGroupId" @change="(val) => onChangeTwoInput('select', val)">
                  <a-select-option :value="Number(item.userGroupId)" v-for="(item, i) in userGroupData" :key="i">
                    {{item.userGroupName}}
                  </a-select-option>
                </a-select>
             </div>        
           </div>
           <div class="oneInput">
             <div class="oneInputLeft">性别</div>
             <div class="oneInputRight">
               <a-radio-group v-model="importParam.gender" @change="(val) => onChangeTwoInput('gender', val)">
                <a-radio :value="1">男</a-radio>
                <a-radio :value="2">女 </a-radio>
              </a-radio-group>
              </div>        
           </div>
           <div class="contTowTtile">
             <h3>映射字段对照表</h3>
           </div>
           <div class="table">
              <a-table 
                :columns="columns" 
                :data-source="tableData || []"
                :pagination="false"
                 bordered
                :scroll="{ x: columns.map(item => item.width).reduce((prev, cur) => prev + cur, 0), y: 500 }"
              >
                <!-- :checked="map[i] == index"  -->
                 <span :slot="i"  v-for="(item, i) in topList" :key="i"  slot-scope="text, record, index">
                   <a-radio :checked="map[i] == index" @click="(e) =>changeRadio(text, record, index, i)"></a-radio>
                 </span>    
              </a-table>
           </div>
         </div>
         <div v-show="current == 2" class="contThree">
           <div class="contTowTtile">
             <h3>映射字段对照表</h3>
           </div>
           <div class="table" v-if="show">
              <a-table 
                :columns="columns2" 
                :data-source="(threeData.userImportDto || {}).userDtos || []"
                :pagination="false"
                 bordered
                :scroll="{ x: columns2.map(item => item.width).reduce((prev, cur) => prev + cur, 0), y: 500 }"
              >    
               <span slot="index" slot-scope="text, record, index">{{index + 1}}</span> 
               <span slot="index2" slot-scope="text, record, index">{{index + 2}}</span> 
               <span slot="action" slot-scope="text, record, index">
                <a-popconfirm
                  title="是否确认删除"
                  ok-text="是"
                  cancel-text="否"
                  @confirm="confirm(record)"
                >
                  <a href="#">删除</a>
                </a-popconfirm>
               </span> 
              </a-table>
              <Pagenation
                :page="threeSearchData.pageNum"
                :pageSize="threeSearchData.pageSize"
                :selectOption="[10,20,50,100]"
                :totle="threeSearchData.totle"
                @changeTable="changeThreeTable"
              />
           </div>
           <div>
             <a-button @click="()=> this.current=0">重新上传</a-button>
             <a-button style="margin-left: 8px" @click="back">返回</a-button>
           </div>
         </div>
      </div>
      <a-modal
        title="正在导入"
        :visible="visib"
        :footer="null"
         destroyOnClose 
      >
        <p><a-icon type="loading" /></p>
      </a-modal>
      <a-modal
        title="导入完成"
        :visible="finshVisb"
         destroyOnClose 
        @ok="()=>this.finshVisb = false"
        @cancel="()=>this.finshVisb = false"
        ok-text="确认" 
        cancel-text="取消"
      >
        <p>导入完成，成功{{finshData.successCount}}条，失败{{finshData.failCount}}条，<span v-show="finshData.failCount > 0"><a :href="finshData.failUrl">点击下载错误日志</a></span></p>
      </a-modal>
  </div>
  </a-spin>
</template>

<script>
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import Pagenation from "./Pagenation/index.vue";
export default {
  data() {
    return {
       locale,
       moment,
       spinning: false,
       columns:[],
       columns2: [
        {
          key: '0',
          title: '序号',
          width: 50,
          scopedSlots: { customRender: 'index' },
        },
        {
          key: '1',
          title: '外部序号',
          width: 50, 
          scopedSlots: { customRender: 'index2' },
        },
        {
          key: '2',
          title: '姓名',
          width: 100, 
          dataIndex: 'name',
        },
        {
          key: '3',
          title: '读者帐号',
          width: 100, 
          dataIndex: 'primaryId',
        },
          {
          key: '4',
          title: '读者证号',
          width: 100, 
          dataIndex: 'content',
        },
        {
          key: '5',
          title: '用户类型',
          width: 100, 
          dataIndex: 'userGroupName',
        },
        {
          key: '6',
          title: '生效日期',
          width: 100, 
          dataIndex: 'effectiveDate',
        },
        {
          key: '7',
          title: '失效日期',
          width: 100, 
          dataIndex: 'expirationDate',
        },
          {
          key: '8',
          title: '操作栏',
          width: 110,
          scopedSlots: { customRender: 'action' },
        },
      ],
       tableData: [],
       topList: [],
       map: {},
       windowWidth: window.innerWidth, //实时屏幕宽度
       windowHeight: window.innerHeight - 280, //实时屏幕高度
       fileData: '',
       timeInterval: '',
       headers: {
        authorization: 'authorization-text',
        jwtAuth: this.getCookie("jwtAuth") ? this.getCookie("jwtAuth") : '' ,  
        mappingPath: this.getCookie("mappingPath") ? this.getCookie("mappingPath") : '' ,
      },
      current: 0,
      inputVlaue: '',
      userGroupData: [],
      importParam: {
        userGroupName: '',
        userGroupId: null,
        effectiveDate: moment(new Date(), 'YYYY-MM-DD'),
        expirationDate: new Date().setMonth(new Date().getMonth() + 1),
        gender: 1,
      },
      threeSearchData: {
        pageNum: 1,
        pageSize: 10,
        totle: null,
      },
      threeData: {},
      visib: false,
      finshVisb: false,
      finshData: {},
      checkedRadio: null,
      show: false
    };
  },
  created: function(){
  },
  
  components: {Pagenation},
  methods: {
    //获取cookie
    getCookie(name) {
      var arr = document.cookie.match(
        new RegExp("(^| )" + name + "=([^;]*)(;|$)")
      );
      if (arr != null) return unescape(arr[2]);
      return false;
    },
    changeInput(e) {
      this.inputVlaue = e.target.value;   
    },
    next() {
      if(this.current == 0 &&  this.inputVlaue != '' && this.fileData != '') {
        this.spinning = true;
        this.$api.isTaskImportNameExists({ taskImportName: this.inputVlaue }).then((res)=>{  // 判断包号是否唯一
        const result = res
          if(result.success && result.data == false){
            this.spinning = false;
            this.current++;
            this.goTwo();  // 第二部分流程开始
          } else {
            this.$message.error("包号重复");
            this.spinning = false;
          }       
        })

      } else if(this.current == 1) {
        const params = {
          effectiveDate: moment(this.importParam.effectiveDate).format('YYYY-MM-DD'),
          expirationDate: moment(this.importParam.expirationDate).format('YYYY-MM-DD'),
          gender:this.importParam.gender == 1 ? '男' :'女' ,
          map: this.map,
          userGroupId: this.importParam.userGroupId,
          userGroupName: this.importParam.userGroupName,
          taskImportName: this.inputVlaue,
          fileFdfsDto: {
            ...this.fileData,
            realmName: null,
          },
        }
        this.spinning = true;
        this.$api.importComposeUser({ ...params }).then((res)=>{
        const result = res
          if(result.success){
            this.importUserKey = result.data.importUserKey;
            this.spinning = false;
            this.current++;
            this.goThree();  // 第三部分流程开始
          }    
        })
      }  else if(this.current == 2) {
        this.verifyImport()
      } else {
        this.spinning = false;
        this.$message.error("请填写信息")
      }
    },
    prev() {
      this.current--;
    },
    down() {
      window.location.href = `https://libstar-offline-fu.oss-cn-beijing.aliyuncs.com/%E8%AF%BB%E8%80%85%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xlsx`
    },
    handleChange(info) {
      if (info.file.status == 'done') {
        let fileList = info.fileList;
          if (fileList.length > 1) {
            fileList.splice(0, 1);
          }
          fileList = fileList.filter((file) => {
            if (file.response) {
              this.fileData = file.response.data
              return file.response.success;
            }
            return true;
          });
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name}上传成功`);
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name}上传失败`);
      }
    },

    goTwo() {
      this.getExcel();
      this.getUserType();
    },

    onChangeTwoInput(name, value) {
      if(name ==='picker') {
        this.importParam.effectiveDate = value;
      } else if(name ==='select') {
        const a = this.userGroupData.filter(item => value == item.userGroupId);
        this.importParam.userGroupName = a[0].userGroupName;
        this.importParam.userGroupId = a[0].userGroupId;
      } else if(name ==='gender') {
        this.importParam.gender = value.target.value;
      }
    },
    getExcel() {
      this.spinning = true;
      this.$api.beforeImportComposeUser({ realmName: null, ...this.fileData }).then((res)=>{  
        const result = res
        if(result.success){
          this.spinning = false;
          result.data.leftList.map(item => {
             this.tableData.push({blank: item})
          })
          this.topList = result.data.topList;
          this.columns = result.data.topList.map((item, idx) => {
            return {
              key: `${idx}`,
              title: item,
              width: 90,
              scopedSlots: { customRender: `${idx}` },
            }
          })
           this.columns.unshift({
              key: 'blank',
              dataIndex: 'blank',
              title: '',
              width: 130,
              fixed: 'left', 
           })
        }
      })
    },

    getUserType() {
      this.$api.getUserType({  // 用户类型下拉
      recordTypeCode:'2'
      }).then((res)=>{
        const result = res;
        this.userGroupData = result.data;
        this.onChangeTwoInput('select', result.data[0].userGroupId)
      });
    },
    changeRadio(text, record, index, i) {
      this.show = false;       // radio框没有选中效果 通过显示和隐藏来强制更新dom
        if (this.map[i] === index) {
          delete this.map[i];
        } else {
          this.map[i] = index;
        }
        this.checkedRadio = this.map[i]
        this.show =true;
    },
    goThree() {
     this.getshowImportUserData();
    },
    getshowImportUserData() {
    const params = {
      map: this.map,
      importUserKey: this.importUserKey,
      ...this.threeSearchData,
    }
    this.$api.showImportUser({ ...params }).then((res)=>{  
      if(res.success){
        this.threeData = res.data;
        this.threeSearchData.totle = res.data.userImportDto.totalNum
        this.spinning = false;
      }
    })
    },
    changeThreeTable(pageNum, pageSize) {
      this.threeSearchData.pageNum = pageNum;
      this.threeSearchData.pageSize = pageSize;
      this.getshowImportUserData();
    },
    confirm(row) {
      const params = {
        importUserKey: this.importUserKey,
        userKeys: [row.userKey],
      }
      this.spinning = true;
      this.$api.deleteUser({ ...params }).then((res)=>{
        if(res.success){
         this.spinning = false;
         this.$message.success(res.message);
         this.getshowImportUserData();
        }    
      })
    },
    verifyImport() {
      let array = [];
      (this.threeData.userImportDto || {}).userDtos.map(item => {
        array.push(item.userKey)
      })
      const params = {
        importUserKey: this.importUserKey,
        userKeys: array,
      }
      this.$api.verifyImport({ ...params }).then((res)=>{
        if(res.success){
         this.spinning = false;
         this.visib = true;
         this.getImportUserTaskStatus();
        }    
      })
    },
    getImportUserTaskStatus() {
      this.Time = setInterval(()=>{
      this.$api.getImportUserTaskStatus().then((res)=>{
        if(res.data.status == 3 ) {
          clearInterval(this.Time)
          this.visib = false;
          this.finshVisb = true;
          this.finshData = res.data;
        } else {
        }
      });
    },2000)
    },
    back() {
      window.location.href="javascript:history.go(-1)"
    },
  },
};

</script>

<style scoped>
 #MainContainer{
   padding: 20px;
 }
  .header{
    display: flex;
    width: 100%;
  }
  .headerLeft{
    width: 80%;
  }
  .headerRight{
    width: 20%;
  }
  .upload{
     display: flex;
 }
  /deep/ .ant-upload-list-item-name {
    padding-right: 20px;
  }
  .oss{
      height: 50px;
      line-height: 50px;
  }
  h3{
    font-weight: bold;
  }
  .cont{
   margin-top: 50px;
  }
  .xing{
    color: red;
  }
  .contOne{
   
  }
  .oneInput{
    padding: 0 20px;
    display: flex;
    margin: 10px 0;
  }
  .tip{
    margin-top: 50px;
    padding: 0 20px;
  }
  .oneInputLeft{
    height: 40px;
    line-height: 40px;
    width: 100px;
  }
  .oneInputRight{
    height: 40px;
    line-height: 40px;
  }
  .contTwo{

  }
  .contTowTtile{
    display: flex;
    height: 20px;
    line-height: 20px;
  }
  .contThree{

  }
  .table{
    margin-top: 10px;
  }
</style>