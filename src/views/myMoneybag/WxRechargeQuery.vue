<template>
<div>
        <el-form :rules="rules" ref="ruleForm" :inline="true" :model="formAllInfo" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="网卡类型">
                <el-select :clearable="true" v-model="formAllInfo.cardClass" filterable placeholder="请选择">
                  <el-option :label="item.className" :value="item.classCode" v-for="item in cardclass" :key="item.classCode"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="套餐类型">
                <el-select :clearable="true" v-model="formAllInfo.cardType" filterable placeholder="请选择">
                  <el-option :label="item.pkName" :value="item.pkBh" v-for="item in cardtype" :key="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8" v-if="isShow">
              <el-form-item label="选择代理商">
                <el-select :clearable="true" v-model="formAllInfo.agentSearch" filterable placeholder="请选择">
                  <el-option :label="item.agentname" :value="item.id" v-for="item in myagent" :key="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="开始日期" prop="fromSearch">
                <el-date-picker
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  v-model="formAllInfo.fromSearch"
                ></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="结束日期" prop="toSearch">
                <el-date-picker
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  v-model="formAllInfo.toSearch"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="4" :offset="9">
              <el-button type="primary" @click="reChargeSearchFn">查询</el-button>
            </el-col>
          </el-row>
        </el-form>

        <el-divider></el-divider>

    <el-table  border  :data="tableList.slice((currentPage-1)*pageSize,currentPage*pageSize)" :stripe="true" style="width: 100%">
      <el-table-column prop="cardnumber" label="卡号" width="180" fixed></el-table-column>
      <el-table-column prop="cardno" label="串号" width="180"></el-table-column>
      <el-table-column prop="cardimsi" label="IMSI" width="180"></el-table-column>
      <el-table-column prop="agentname" label="代理商" width="180"></el-table-column>
      <el-table-column prop="className" label="卡类型"></el-table-column>
      <el-table-column prop="pkname" label="套餐类型"></el-table-column>
      <el-table-column prop="rechargeamt" label="套餐金额" width="180"></el-table-column>
      <el-table-column prop="percentageamt" label="提成金额" width="180"></el-table-column>
      <el-table-column prop="processtime" label="充值时间" width="180"></el-table-column>
      <el-table-column prop="orderNo" label="订单号" width="180"></el-table-column>

      <el-table-column align="right" width="200" fixed="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="keySearch"
            size="mini"
            placeholder="输入卡号搜索"/>
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
import pagination from "../../components/myMoneybag/pagination";
export default {
    name: 'WxRechargeQuery',
    data() {
        return {
            formAllInfo:{},
            rules: {
              fromSearch: [
                { required: true, message: '必填', trigger: 'blur' }
              ],
              toSearch: [
                { required: true, message: '必填', trigger: 'blur' }
              ]
            },
            isShow:false,
            cardclass:[],
            cardtype:[],
            myagent:[],
            tableData:[],
            currentPage: 1, //当前第一页
            pageSize:30, //默认每页1条数据
            pageSizes:[30,50,100], //设置每页显示多少条
            keySearch:"",
        }
    },
    components: {pagination},
    created(){
        this.wxCardTypeAndClassFn();
    },
    computed:{
        //复制一份表格数据
      tableList() {
          return this.tableData.filter(item => {
              if (item.cardnumber.includes(this.keySearch)) {
                  return item;
              }
              this.currentPage = 1;
          });
      }

    },
    methods:{
        handleSizeChange(data) {
            this.pageSize = data;
            this.currentPage = 1;
        },
        handleCurrentChange(data) {
            this.currentPage = data;
        },
        async wxCardTypeAndClassFn(){
            let paramsObj={
                userId:localStorage.getItem("userid"),
                userName:JSON.parse(localStorage.getItem("userLoginInfo")).username,
                agentId:localStorage.getItem("agentid"),
                userType:localStorage.getItem("usertype"),
            };
            try{
                const data = await this.$axios.post(
                "/fr/MyWallet/wxCardTypeAndClass",
                this._qs.stringify(paramsObj)
                );
                if(data.errcode==0){
                    if(data.flag){
                        this.isShow=true;
                        this.myagent=data.myagent.data;
                    }else{
                        this.isShow=false;
                        this.myagent=[];
                    }
                    this.cardclass=data.cardclass;
                    this.cardtype=data.cardtype.data;
                }
            }catch (err) {
                this.$message.error("服务器异常，请稍后再试！");
            }
        },

        reChargeSearchFn(){

          this.$refs["ruleForm"].validate(async (valid) => {
            if (valid) {
              let paramsObj={
                  userName :JSON.parse(localStorage.getItem("userLoginInfo")).username,
                  userId:localStorage.getItem("userid"),
                  userType :localStorage.getItem("usertype"),
                  agentId:localStorage.getItem("agentid")
              }
              paramsObj={...paramsObj,...this.formAllInfo}
              try {
                  const data = await this.$axios.post(
                  "/fr/MyWallet/reChargeSearch",
                  this._qs.stringify(paramsObj),
                  );
                  if(data.errcode==0){
                      this.tableData=data.data.data;
                  }else{
                      this.$message.error(data.errmsg);
                  }
              } catch (err) {
                  this.$message.error("服务器异常，请稍后再试！");
              }
            }else {
              return false;
            }
          });



            
        },




    }
}
</script>

<style scoped>

</style>