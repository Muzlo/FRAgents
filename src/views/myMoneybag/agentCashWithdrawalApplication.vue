<template>
  <div>
    <div class="clearfix">
      <el-button type="primary" size="mini" class="fr ml-15 mb-15" @click="downLoadAgentCashReq">导出申请</el-button>
    </div>
    <el-table  border :data="tableList.slice((currentPage-1)*pageSize,currentPage*pageSize)" :stripe="true" style="width: 100%">
      <el-table-column width="250" prop="agentname" label="代理商名称"></el-table-column>
      <el-table-column width="250" prop="bankname" label="开户行"></el-table-column>
      <el-table-column width="200" prop="bankcardno" label="银行卡号"></el-table-column>
      <el-table-column width="200" prop="reqdate" label="申请日期"></el-table-column>
      <el-table-column width="100" prop="reqamt" label="提现金额"></el-table-column>

      <el-table-column align="right" width="200" fixed="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="keySearch"
            size="mini"
            placeholder="输入代理商搜索"/>
        </template>

        <template v-slot="scope">
          <el-button size="mini" type="success" @click="confirmRetReq(scope.row)">转账</el-button>
        </template>

      </el-table-column>
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
        <el-form-item label="申请金额">
          <el-input disabled v-model="diaForm.reqAmt"></el-input>
        </el-form-item>
        <el-form-item label="转账金额">
          <el-input v-model.trim="diaForm.retAmt" @input.native="keydownhandle"></el-input>
        </el-form-item>
      </div>
    </publicForm>

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
import pagination from "../../components/myMoneybag/pagination";
import publicForm from "../../components/myMoneybag/publicForm";
export default {
  name: "agentCashWithdrawalApplication",
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
      formInline: true,
      //接口地址
      url: {
          updUrl: `/fr/MyWallet/confirmRetReq`,
      },
      disabledBtn:true
    };
  },
  components: {pagination,publicForm},
  created() {
      this.tableFn();
  },
  methods: {
    keydownhandle(e) {

      e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null;
      if(e.target.value){
        if(this.diaForm.reqAmt-e.target.value>=0){
          this.disabledBtn=false
        }else{
          this.$message.error("转账金额不能大于提现金额!");
          this.disabledBtn=true;
          return false;
        }
      }

   
    },
    resetForm(data) {
      let formOtherInfo = {
          agentId: localStorage.getItem("agentid"),
          userId: localStorage.getItem("userid"),
          userName: JSON.parse(localStorage.getItem("userLoginInfo")).username
      };
      this.diaForm = { ...formOtherInfo, ...data };
    },

    //转账
    confirmRetReq(data){
      this.formTitle = "确认转账";
      this.$store.commit("dialogVisible/dialogVisibleMutations", true);
      this.otherInfo = "1";
      let formOtherInfo = {
          agentId: localStorage.getItem("agentid"),
          userId: localStorage.getItem("userid"),
          userName: JSON.parse(localStorage.getItem("userLoginInfo")).username
      };
      this.diaForm ={
          ...formOtherInfo,
          reqId:data.id,
          reqAmt:data.reqamt,
          retAmt:this.diaForm.retAmt
      }
            
    },
    //导出申请
    async downLoadAgentCashReq(){
      let paramsObj = {
        userName:JSON.parse(localStorage.getItem("userLoginInfo")).username,
        userId:localStorage.getItem("userid"),
        agentId:localStorage.getItem("agentid")
      };
      try {
        let data = await this.$axios.post(
          `/fr/MyWallet/downLoadAgentCashReq`,
          this._qs.stringify(paramsObj)
        );
        if (data.errcode == 0) {
          window.location.href=data.downUrl;
        } else {
          this.$message.error(data.errmsg);
        }
      } catch (err) {
        this.$message.error("服务器异常，请稍后再试！");
      }

    },
    async tableFn() {
      let paramsObj = {
        userName: JSON.parse(localStorage.getItem("userLoginInfo")).username,
        userId: localStorage.getItem("userid"),
        agentId: localStorage.getItem("agentid")
      };

      try {
        let data = await this.$axios.post(
          `/fr/MyWallet/agentCashRequestList`,
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
        if (item.agentname.includes(this.keySearch)) {
          return item;
        }
        this.currentPage = 1;
      });
    }
  }
};
</script>

<style scoped>
</style>