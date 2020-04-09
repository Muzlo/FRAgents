<template>
  <div>
    <div class="clearfix">

      <el-alert :title="title" description="友情提示：1.尽量在工作日提现 2.提现金额尽量大于50元" type="success" :closable='false'></el-alert>
      <el-button type="primary" size="mini" class="fr mt-15 ml-15 mb-15" @click="confirmRetReq()">提现申请</el-button>
    </div>

    <el-divider>我的提现记录</el-divider>
    
    <el-table
      border
      :data="tableList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      :stripe="true"
      style="width: 100%"
    >
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.reqstatus=='00'">申请待处理</span>
          <span v-else-if="scope.row.reqstatus=='01'">已处理完成</span>
        </template>
      </el-table-column>
      <el-table-column width="250" prop="reqdate" label="提现时间"></el-table-column>
      <el-table-column width="200" prop="reqamt" label="提现金额"></el-table-column>
      <el-table-column width="250" prop="retdate" label="到账时间"></el-table-column>
      <el-table-column width="200" prop="retamt" label="到账金额"></el-table-column>
    </el-table>

    <publicForm
      :inline="formInline"
      :otherInfo="otherInfo"
      :width="formWidth"
      :formTitle="formTitle"
      :form="diaForm"
      :url="url"
      @resetFormEmit="resetForm"
      :disabledBtn="disabledBtn"
    >
      <div slot="formContent">
        <el-form-item label="账户余额">
          <el-input disabled v-model="allMoney"></el-input>
        </el-form-item>
        <el-form-item label="提现金额">
          <el-input v-model.trim="diaForm.reqAmt" @input.native="keydownhandle"></el-input>
        </el-form-item>
      </div>
    </publicForm>

    <pagination
      class="fr"
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
import pagination from "../../components/myMoneybag/pagination";
import publicForm from "../../components/myMoneybag/publicForm";
export default {
  name: "myCashWithdrawalApplication",
  data() {
    return {
      tableData: [],
      currentPage: 1, //当前第一页
      pageSize: 30, //默认每页1条数据
      pageSizes: [30, 50, 100], //设置每页显示多少条
      keySearch: "",
      otherInfo: "-1", //标记 '0'新增 '1'修改
      formWidth: "700px",
      formTitle: "",
      diaForm: {},
      allMoney:null,
      formInline: true,
      //接口地址
      url: {
        updUrl: `/fr/MyWallet/saveMyCaseRequest`
      },
      disabledBtn: true
    };
  },
  components: { pagination, publicForm },
  created() {
    this.tableFn();
    this.allMoneyFn();
  },
  methods: {
    async allMoneyFn(){
      try{
        let paramsObj={
          agentId : localStorage.getItem("agentid"),
          userId:localStorage.getItem("userid"),
        }
        let data = await this.$axios.post(
          `/fr/DataCount/getAccountCount`,
          this._qs.stringify(paramsObj)
        );
        if (data.errcode == 0) {
          if(data.data){
            if(data.agentMs.data.ispre){
              this.allMoney=data.data.retamt-data.data.inamt-data.data.reqamt 
            }else{
              this.allMoney=data.data.startamt+data.data.inamt-data.data.reqamt
            }
          }else{
            this.allMoney=0
          }
          
        } else {
          this.$message.error(data.errmsg);
        }
      }catch(err){
        this.$message.error("服务器异常，请稍后再试！");
      }
    },
    keydownhandle(e) {
      e.target.value = e.target.value.match(/^\d*(\.?\d{0,2})/g)[0] || null;
      if (e.target.value) {
        if (this.allMoney - e.target.value >= 0) {
          this.disabledBtn = false;
        } else {
          this.$message.error("提现金额不能大于账户金额!");
          this.disabledBtn = true;
          return false;
        }
      }
    },
    resetForm(data) {
      let formOtherInfo = {
        agentId : localStorage.getItem("agentid"),
        userId : localStorage.getItem("userid"),
        userName : JSON.parse(localStorage.getItem("userLoginInfo")).username,
        lastSession:localStorage.getItem("lastSession")
      };
      this.diaForm = { ...formOtherInfo, ...data };
    },

    //提现申请
    confirmRetReq() {
      this.formTitle = "提现申请";
      this.$store.commit("dialogVisible/dialogVisibleMutations", true);
      this.otherInfo = "1";
      let formOtherInfo = {
        agentId : localStorage.getItem("agentid"),
        userId : localStorage.getItem("userid"),
        userName : JSON.parse(localStorage.getItem("userLoginInfo")).username,
        lastSession:localStorage.getItem("lastSession")
      };
      this.diaForm = {
        ...formOtherInfo,
        reqAmt:this.diaForm.reqAmt
      };
    },
    async tableFn() {
      let paramsObj = {
        userName: JSON.parse(localStorage.getItem("userLoginInfo")).username,
        userId: localStorage.getItem("userid"),
        agentId: localStorage.getItem("agentid")
      };

      try {
        let data = await this.$axios.post(
          `/fr/MyWallet/cashRequestList`,
          this._qs.stringify(paramsObj)
        );
        if (data.errcode == 0) {
          this.tableData = data.data.data;
        } else {
          this.$message.error(data.errmsg);
        }
      } catch (err) {
        this.$message.error("服务器异常，请稍后再试！");
      }
    },
    handleSizeChange(data) {
      this.pageSize = data;
      this.currentPage = 1;
    },
    handleCurrentChange(data) {
      this.currentPage = data;
    }
  },
  computed: {
    //复制一份表格数据
    tableList() {
      return this.tableData.filter(item => {
        return item;
        this.currentPage = 1;
      });
    },
    title(){
      return "当前账户可提现金额："+this.allMoney+"元"
    }
  }
};
</script>

<style scoped>
</style>