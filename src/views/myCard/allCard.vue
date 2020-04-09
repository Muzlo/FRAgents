<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="查询方式一" name="first">
        <el-form ref="formSearchTpye1" :inline="true" :model="formAllInfo" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="网卡类型">
                <el-select :clearable="true" v-model="formAllInfo.cardClass" filterable placeholder="请选择">
                  <el-option :label="item.className" :value="item.classCode" v-for="item in cardClassList" :key="item.classCode"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="代理商">
                <el-select :clearable="true" v-model="formAllInfo.agentId" filterable placeholder="请选择">
                  <el-option :label="item.agentname" :value="item.id" v-for="item in agentsList" :key="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
    
            <el-col :span="8">
              <el-form-item label="网卡状态">
                <el-select :clearable="true" v-model="formAllInfo.cardStatus" filterable placeholder="请选择">
                  <el-option :label="item.statusName" :value="item.statusCode" v-for="item in cardStatusList" :key="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结束日期">
                <el-date-picker
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  v-model="formAllInfo.endDate"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="号码类型">
            <el-select :clearable="true" v-model="formAllInfo.numberType" filterable placeholder="请选择">
              <el-option label="卡号" value="0"></el-option>
              <el-option label="串号" value="1"></el-option>
              <el-option label="IMSI号" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formAllInfo.startCardNumber" placeholder="起始卡号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formAllInfo.endCardNumber" placeholder="结束卡号"></el-input>
          </el-form-item>

          <el-row>
            <el-col :span="4" :offset="9">
              <el-button type="primary" @click="searchformAllInfoFn('getCardSearch')">查询</el-button>
              <el-button type="primary" @click="searchformAllInfoFn('download')">导出</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="查询方式二" name="second">
        <el-form ref="formSearchTpye2" :model="formAllInfo2" label-width="80px">
          <el-form-item label="号码类型">
            <el-select :clearable="true" v-model="formAllInfo2.numberType2" filterable placeholder="请选择">
              <el-option label="卡号" value="0"></el-option>
              <el-option label="串号" value="1"></el-option>
              <el-option label="IMSI号" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="批量查询">
            <el-input type="textarea" placeholder="卡号间用英文,隔开" v-model="formAllInfo2.cardBatch"></el-input>
          </el-form-item>

          <el-row>
            <el-col :span="4" :offset="9">
              <el-button type="primary" @click="searchform2AllInfoFn('getCardSearch')">查询</el-button>
              
              <el-button type="primary" @click="searchform2AllInfoFn('download')">导出</el-button>
              
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <el-divider></el-divider>
    <el-table  border :height="tableHeight"  :data="tableList.slice((currentPage-1)*pageSize,currentPage*pageSize)" :stripe="true" style="width: 100%">
      <el-table-column prop="vrCardNumber" label="卡号" width="180" fixed></el-table-column>
      <el-table-column prop="cardNo" label="串号" width="180"></el-table-column>
      <el-table-column prop="cardImsi" label="IMSI" width="180"></el-table-column>
      <el-table-column prop="className" label="卡类型" width="180"></el-table-column>
      <el-table-column prop="typeName" label="套餐类型" width="180"></el-table-column>
      <el-table-column prop="cardTotalData" label="总流量" width="180"></el-table-column>
      <el-table-column prop="cardUsedData" label="已用流量" width="180"></el-table-column>
      <el-table-column label="剩余流量" width="180">
        <template v-slot="scope">
          {{(scope.row.cardTotalData- scope.row.cardUsedData) | toFixed}}
        </template>
      </el-table-column>

      <el-table-column prop="cardStartDate" label="开始日期" width="180"></el-table-column>
      <el-table-column prop="cardEndDate" label="结束日期" width="180"></el-table-column>
      <el-table-column prop="agentname" label="代理商" width="180"></el-table-column>
      <el-table-column prop="cardUpdate" label="更新日期" width="180"></el-table-column>
      <el-table-column prop="statusName" label="状态" width="80"></el-table-column>
      <el-table-column prop="firsttypename" label="初始套餐" width="180"></el-table-column>
      <el-table-column prop="importdate" label="导入时间" width="180"></el-table-column>



      <el-table-column align="right" width="200" fixed="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="keySearch"
            size="mini"
            placeholder="输入卡号搜索"/>
        </template>

        <template slot-scope="scope">

          <el-button size="mini" @click="huishouFn(scope.row.cardid)">回收</el-button>
  
          <el-button size="mini" type="danger" @click="delFn(scope.row.cardid)">删除</el-button>

        </template>

      </el-table-column>
    </el-table>

    <pagination class="fr"
      :total="tableList.length"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      @handleSizeChangeEmit="handleSizeChange"
      @handleCurrentChangeEmit="handleCurrentChange"
    />

  </div>
</template>

<script>
import { baseURL } from "../../common/js/ipconfig.js";
import pagination from "../../components/myCard/pagination";
export default {
  name: "allCard",
  data() {
    return {
      activeName: "first",
      formAllInfo:{
        agentId:null
      },//tab1
      formAllInfo2:{},//tab2
      agentsList:[],//代理商列表
      cardClassList:[],//卡类型列表
      cardStatusList:[],//卡状态列表
      fileList:[],
      tableData:[],
      currentPage: 1, //当前第一页
      pageSize:30, //默认每页1条数据
      pageSizes:[30,50,100], //设置每页显示多少条
      keySearch:"",
      windowHeight:"",//窗口高度
 
    };
  },
  components: {pagination},

  mounted() {
      this.getMyAgentFn();
      this.getCardStatusFn();
      this.getCardClassFn();
      this.windowHeight=document.documentElement.clientHeight;
      window.onresize=()=>{
          this.windowHeight=document.documentElement.clientHeight;
      }
  },
  computed: {
      //表格高度
      tableHeight() {
          return this.windowHeight-350
      },
      //复制一份表格数据
      tableList() {
          return this.tableData.filter(item => {
              if (item.vrCardNumber.includes(this.keySearch)) {
                  return item;
              }
              this.currentPage = 1;
          });
      }
  },
  filters:{
      toFixed(data){
          return data.toFixed(2)
      }
  },
  methods: {

    confirmFn(txt,cb){
        this.$confirm(`是否确认${txt}?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            cb();
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
        });
    },

    //单个回收
    huishouFn(id){
        var huiShou=async ()=>{
            let paramsObj={
                userid:localStorage.getItem("userid"),
                username:JSON.parse(localStorage.getItem("userLoginInfo")).username,
                cardid:id
            };

            try{
                const data = await this.$axios.post(
                "/fr/REUSIM/RecoveAgent",
                this._qs.stringify(paramsObj),
                );
                data.errcode==0 ? this.$message.success(data.errmsg) :this.$message.error(data.errmsg)
            }catch (err) {
                this.$message.error("服务器异常，请稍后再试！");
            }
        }
        this.confirmFn("回收",huiShou);
    },

    delFn(id){
      let paramsObj={
        userName :JSON.parse(localStorage.getItem("userLoginInfo")).username,
        userId :localStorage.getItem("userid"),
        usertype: localStorage.getItem("usertype"),
        cardid:id
      }

      this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try{
            let data=await this.$axios.post("/fr/AllUSIM/delAgentCard",this._qs.stringify(paramsObj));
            this.$message({
              type: 'success',
              message: data.errmsg
            }); 
          }catch(err){
            this.$message({
              type: 'error',
              message: '服务器异常！'
            }); 
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });

    },
    async searchform2AllInfoFn(url){
       let paramsObj={
          username:JSON.parse(localStorage.getItem("userLoginInfo")).username,
          userId:localStorage.getItem("userid"),
          agent:localStorage.getItem("agentid")
        }
        paramsObj={...paramsObj,...this.formAllInfo2};
        try {
            const data = await this.$axios.post(
            "/fr/AllUSIM/"+url,
            this._qs.stringify(paramsObj),
            );
            if(data.errcode==0){
                if(url=="getCardSearch"){
                  this.tableData=data.data;
                }else if(url=="download"){
                  this.$message.success(data.errmsg);
                }
            }else{
                this.$message.error(data.errmsg);
            }
            
        } catch (err) {
            console.log(err);
            this.$message.error("服务器异常，请稍后再试！");
        }

    },

    async searchformAllInfoFn(url){
        let paramsObj={
          username:JSON.parse(localStorage.getItem("userLoginInfo")).username,
          userId:localStorage.getItem("userid"),
          agent:localStorage.getItem("agentid")
        }
        paramsObj={...paramsObj,...this.formAllInfo}

        if((this.formAllInfo.endCardNumber || this.formAllInfo.startCardNumber) &&  !this.formAllInfo.numberType){
          this.$message.warning("请选择号码类型！");
          return;
        }else{
            try {
                const data = await this.$axios.post(
                "/fr/AllUSIM/"+url,
                this._qs.stringify(paramsObj),
                );
                if(data.errcode==0){
                    if(url=="getCardSearch"){
                      this.tableData=data.data;
                    }else if(url=="download"){
                      this.$message.success(data.errmsg);
                    }
                }else{
                    this.$message.error(data.errmsg);
                }
                
            } catch (err) {
                console.log(err);
                this.$message.error("服务器异常，请稍后再试！");
            }
        }

     
    },

    async getMyAgentFn(){
        try {
            const data = await this.$axios.post(
            "/fr/AllUSIM/myAgent",
            this._qs.stringify({
              agentId: localStorage.getItem("agentid"),
              userId:localStorage.getItem("userid"),
              username:JSON.parse(localStorage.getItem("userLoginInfo")).username
            }),
            );
            if(data.errcode==0){
                this.agentsList=data.data.data;
            }else{
                this.$message.error(data.errmsg);
            }
            
        } catch (err) {
            console.log(err);
            this.$message.error("服务器异常，请稍后再试！");
        }
    },
    async getCardClassFn(){
        let paramsObj={
          username:JSON.parse(localStorage.getItem("userLoginInfo")).username,
          userId:localStorage.getItem("userid"),
          agentId:localStorage.getItem("agentid")
        }
        try {
            const data = await this.$axios.post(
            "/fr/AllUSIM/cardClass",
            this._qs.stringify(paramsObj),
            );
            if(data.errcode==0){
                this.cardClassList=data.data;
            }else{
                this.$message.error(data.errmsg);
            }
            
        } catch (err) {
            console.log(err);
            this.$message.error("服务器异常，请稍后再试！");
        }
    },
    async getCardStatusFn(){
        try {
            const data = await this.$axios.post("/fr/AllUSIM/cardStatus",
            this._qs.stringify({
                userId:localStorage.getItem("userid"),
                username:JSON.parse(localStorage.getItem("userLoginInfo")).username
            }),
            );
            if(data.errcode==0){
                this.cardStatusList=data.data.data;
            }else{
                this.$message.error(data.errmsg);
            }
            
        } catch (err) {
            console.log(err);
            this.$message.error("服务器异常，请稍后再试！");
        }
    },
    handleSizeChange(data) {
        this.pageSize = data;
        this.currentPage = 1;
    },
    handleCurrentChange(data) {
        this.currentPage = data;
    },
  },

  // beforeRouteEnter (to, from, next) {
  //   next(vm => {
  //     if(vm.$route.params.id){
  //       vm.formAllInfo.agentId=vm.$route.params.id
  //     }
  //   })
  // }


};
</script>

<style scoped>
</style>