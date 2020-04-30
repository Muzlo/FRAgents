<template>
    <div>
        
        <el-form size="mini" :inline="true" :model="form" label-width="100px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="代理商">
<<<<<<< HEAD
                        <agentsListComponent @searchDataEmit="searchDataEmitFn"></agentsListComponent>
=======
                        <el-select v-model="form.agentsList" filterable placeholder="请选择" @change="searchData">
                            <el-option :label="item.agentname" :value="item.id" v-for="item in agentsList" :key="item.id"></el-option>
                        </el-select>
>>>>>>> 24ae6c0fddc4ac1ed50dd84e437ae9788bdebdac
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-divider>查询结果</el-divider>

<el-table border :stripe="true" :data="tableList.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%">
    <el-table-column fixed type="index"></el-table-column>
    <el-table-column fixed label="网卡类型" prop="cardClass" width="200" align="center"></el-table-column>
    <el-table-column label="套餐代码" prop="pkBh" width="200" align="center"></el-table-column>
    <el-table-column label="套餐名称" prop="pkName" width="200" align="center"></el-table-column>
    <el-table-column label="流量" prop="pkData" width="200" align="center"></el-table-column>
    <el-table-column label="有效时长(月)" prop="pkMonth" width="200" align="center"></el-table-column>
    <el-table-column label="套餐金额" prop="pkMoney" width="100" align="center"></el-table-column>
    <el-table-column label="我的提成" prop="toppercentageamt" width="100" align="center"></el-table-column>
    <el-table-column label="提成金额" prop="percentageamt" width="100" align="center"></el-table-column>

    <el-table-column align="right" fixed="right" width="200">
      <template slot="header" slot-scope="scope">
        <el-input v-model="keySearch" size="mini" placeholder="输入网卡类型搜索"/>
      </template>
      <template slot-scope="scope">
        <el-tooltip effect="dark" content="修改提成金额" placement="top-start">
            <el-button size="mini" type="success" icon="el-icon-edit" @click="editPercent(scope.row)"></el-button>
        </el-tooltip>

      </template>
    </el-table-column>
</el-table>
    <pagination
      class="fr"
      :total="tableList.length"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      @handleSizeChangeEmit="handleSizeChange"
      @handleCurrentChangeEmit="handleCurrentChange"
    />


<publicForm
      :inline="formInline"
      :otherInfo="otherInfo"
      :width="formWidth"
      :formTitle="formTitle"
      :form="diaForm"
      :url="url"
      @resetFormEmit="resetForm"
    >
      <div slot="formContent">
        <el-form-item label="套餐名称">
          <el-input disabled v-model="diaForm2.pkName"></el-input>
        </el-form-item>
        <el-form-item label="总流量">
          <el-input disabled v-model="diaForm2.pkData"></el-input>
        </el-form-item>
        <el-form-item label="有效时长（月）">
          <el-input disabled v-model="diaForm2.pkMonth"></el-input>
        </el-form-item>
        <el-form-item label="套餐金额">
          <el-input disabled v-model="diaForm2.pkMoney"></el-input>
        </el-form-item>
        <el-form-item label="我的提成">
          <el-input disabled v-model="diaForm.topAgentAmt"></el-input>
        </el-form-item>
        <el-form-item label="提成金额">
          <el-input v-model.trim="diaForm.PercentAmt" @input.native="keydownhandle"></el-input>
        </el-form-item>
      </div>
    </publicForm>

    
    </div>
</template>

<script>
import pagination from "../../components/myCard/pagination";
import publicForm from "../../components/myCard/publicForm";
<<<<<<< HEAD
import agentsListComponent from "../../components/agents/agentsList";
=======
>>>>>>> 24ae6c0fddc4ac1ed50dd84e437ae9788bdebdac
export default {
    name: 'agentsWxRoyaltySet',
    data() {
        return {
            form: {},
            tableData: [],
            currentPage: 1, //当前第一页
            pageSize: 30, //默认每页1条数据
            pageSizes: [30, 50, 100], //设置每页显示多少条
            keySearch: "",
            agentsList:null,
            otherInfo: "-1", //标记 '0'新增 '1'修改
            formWidth: "700px",
            formTitle: "",
            diaForm: {},
            diaForm2: {},
            formInline: true,
            //接口地址
            url: {
                updUrl: `/fr/MyAgent/savePercent`,
            }
        }
    },
    created(){
        this.getMyAgentFn();
    },
    components: { pagination,publicForm},
    computed: {
        //复制一份表格数据
        tableList() {
            return this.tableData.filter(item => {
                if (item.pkBh.includes(this.keySearch)) {
                    return item;
                }
                this.currentPage = 1;
            });
        }
    },
    methods:{
        keydownhandle(e) {
            e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
        },
        resetForm(data) {
            let formOtherInfo = {
                agentId: localStorage.getItem("agentid"),
                userId: localStorage.getItem("userid"),
                userName: JSON.parse(localStorage.getItem("userLoginInfo")).username
            };
            this.diaForm = { ...formOtherInfo, ...data };
        },
        handleSizeChange(data) {
            this.pageSize = data;
            this.currentPage = 1;
        },
        handleCurrentChange(data) {
            this.currentPage = data;
        },
        async getMyAgentFn(){
            try {
                const data = await this.$axios.post(
                "/fr/AllUSIM/myAgent",
                this._qs.stringify({agentId: localStorage.getItem("agentid")}),
                );
                if(data.errcode==0){
                    this.agentsList=data.data;
                }else{
                    this.$message.error(data.errmsg);
                }
                
            } catch (err) {
                console.log(err);
                this.$message.error("服务器异常，请稍后再试！");
            }
        },
        async searchData(){
            let paramsObj={
                selAgentId:this.form.agentsList,
                userId:localStorage.getItem("userid"),
                userName :JSON.parse(localStorage.getItem("userLoginInfo")).username
            };
            try {
                const data = await this.$axios.post(
                "/fr/MyAgent/agentPercent",
                this._qs.stringify(paramsObj),
                );
                if(data.errcode==0){
                    this.tableData=data.data.data
                }else{
                    this.$message.error(data.errmsg);
                }
                
            } catch (err) {
                console.log(err);
                this.$message.error("服务器异常，请稍后再试！");
            }
<<<<<<< HEAD

        }
=======
        },
        //修改提成
        editPercent(data) {
            this.formTitle = "修改提成设定";
            this.$store.commit("dialogVisible/dialogVisibleMutations", true);
            this.otherInfo = "1";
            let formOtherInfo = {
                agentId: localStorage.getItem("agentid"),
                userId: localStorage.getItem("userid"),
                userName: JSON.parse(localStorage.getItem("userLoginInfo")).username
            };

            this.diaForm ={
                ...formOtherInfo,
                cardTypeId:data.id,
                selAgentId:data.agentid,
                topAgentAmt:data.toppercentageamt,
                PercentAmt:this.diaForm.PercentAmt || data.percentageamt,
                // pkName:data.pkName,
                // pkData:data.pkData,
                // pkMonth:data.pkMonth,
                // pkMoney:data.pkMoney,
                // toppercentageamt:data.toppercentageamt
            }
            this.diaForm2 ={
                pkName:data.pkName,
                pkData:data.pkData,
                pkMonth:data.pkMonth,
                pkMoney:data.pkMoney,
                //toppercentageamt:data.toppercentageamt
            }

        },
>>>>>>> 24ae6c0fddc4ac1ed50dd84e437ae9788bdebdac

    },
    directives: {
    }
}
</script>

<style scoped>

</style>