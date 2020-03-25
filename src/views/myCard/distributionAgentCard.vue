<template>
    <div>
        <el-tabs v-model="activeName">
            <el-tab-pane label="方式一" name="first">
                <el-form size="mini" ref="formSearchTpye1" :inline="true" :model="formAllInfo" label-width="100px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="代理商">
                                <el-select v-model="formAllInfo.agentsList" filterable placeholder="请选择">
                                <el-option :label="item.agentname" :value="item.id" v-for="item in agentsList" :key="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="16">
                            
                            <el-form-item label="卡号范围查询">
                                <el-input v-model="formAllInfo.startCard" placeholder="起始卡号"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="formAllInfo.endCard" placeholder="结束卡号"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="searchTableData()">查询</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="allFenPeiFn">全部分配</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-tab-pane>

            <el-tab-pane label="方式二" name="second">
                <el-form size="mini" ref="formSearchTpye2" :inline="true" :model="formAllInfo2" label-width="100px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="代理商">
                                <el-select v-model="formAllInfo2.agentsList" filterable placeholder="请选择">
                                <el-option :label="item.agentname" :value="item.id" v-for="item in agentsList" :key="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="16">
                            <el-form-item>
                                <el-upload
                                ref="upload"
                                action="#"
                                accept=".xls,.xlsx"
                                :file-list="fileList"
                                :show-file-list="false"
                                :beforeUpload="beforeAvatarUpload"
                                :http-request="httpRequest"
                                >
                                    <el-button type="primary">Excel 导入分配</el-button>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>


            </el-tab-pane>


        </el-tabs>


        <el-divider>查询结果</el-divider>


<el-table border :stripe="true" :height="tableHeight" :data="tableList.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%">
    <el-table-column fixed type="index"></el-table-column>
    <el-table-column fixed label="卡号" prop="cardNumber" width="140" align="center"></el-table-column>
    <el-table-column label="串号" prop="cardNo" width="200" align="center"></el-table-column>
    <el-table-column label="IMSI号" prop="cardImsi" width="170" align="center"></el-table-column>
    <el-table-column label="卡类型" prop="className" width="200" align="center"></el-table-column>
    <el-table-column label="套餐类型" prop="typeName" width="200" align="center"></el-table-column>

    <el-table-column label="总流量" prop="cardTotalData" width="100" align="center"></el-table-column>

    <el-table-column label="已用流量" prop="cardUsedData" width="100" align="center"></el-table-column>
    <el-table-column label="剩余流量" align="center" width="100">
        <template v-slot="scope">
            {{scope.row.cardTotalData-scope.row.cardUsedData |toFixed}}
        </template>
    </el-table-column>
    <el-table-column label="开始日期" prop="cardStartDate" align="center" width="200"></el-table-column>
    <el-table-column label="结束日期" prop="cardEndDate" align="center" width="200"></el-table-column>
    <el-table-column label="结束日期" prop="cardEndDate" align="center" width="200"></el-table-column>
    <el-table-column label="更新日期" prop="importdate" align="center" width="200"></el-table-column>
    <el-table-column label="网卡状态" prop="statusName" align="center"></el-table-column>

    <el-table-column align="right" fixed="right" width="150">
      <template slot="header" slot-scope="scope">
        <el-input v-model="keySearch" size="mini" placeholder="输入卡号搜索"/>
      </template>
      <template slot-scope="scope">
        <el-button size="mini" type="success" @click="fenPei(scope.row.agentcardid)">分配</el-button>
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
    name: 'distributionAgentCard',
    data() {
        return {
            activeName: "first",
            formAllInfo:{},//tab1
            formAllInfo2:{},//tab2
            agentsList:[],//代理商列表
            fileList:[],
            tableData:[],
            currentPage: 1, //当前第一页
            pageSize:3, //默认每页1条数据
            pageSizes:[3,50,100], //设置每页显示多少条
            keySearch:"",
            windowHeight:"",//窗口高度
        }
    },
    components: {pagination},
    created(){},
    mounted() {
        this.getMyAgentFn();
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
                if (item.cardNumber.includes(this.keySearch)) {
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
    methods:{
        async searchTableData(){
            let userid={
                userid:localStorage.getItem("userid")
            }
            let agentid={
                agentid:localStorage.getItem("agentid")
            }
            let searchObj={...this.formAllInfo,...userid,...agentid};
            try{
                const data = await this.$axios.post(
                "/fr/USIM/queryAgentUSIM",
                this._qs.stringify(searchObj),
                );
                if(data.errcode==0){
                    this.tableData=data.data
                }
            }catch(err){
                this.$message.error("服务器异常，请稍后再试！");
            }
        },
        async getMyAgentFn(){
            try {
                const data = await this.$axios.post(
                "/fr/USIM/getMyAgent",
                this._qs.stringify({agentid: localStorage.getItem("agentid")}),
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
        beforeAvatarUpload(file) {      
            var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)                
            const extension = testmsg === 'xls'
            const extension2 = testmsg === 'xlsx'
            if(!extension && !extension2) {
                this.$message({
                    message: '上传文件只能是 xls、xlsx格式!',
                    type: 'warning'
                });
            }
            return extension || extension2
        },
        httpRequest(param) {
          if(this.formAllInfo2.agentsList){
            let fileObj = param.file // 相当于input里取得的files
            let fd = new window.FormData()// FormData 对象
            fd.append('files', fileObj)// 文件对象
            fd.append('flowPoolId', this.flowPoolId)// 文件对象
            let url = `${baseURL.ip1}/`;
            var options = {
                url: url,
                data: fd,
                method: 'post',
                headers: { 
                  'Content-Type': 'multipart/form-data'
                }
            }
            this.$axios(options).then((res)=>{
              this.$message.success(res.message);
            }).catch((err)=>{
              this.$message.error('上传失败！');
            })
          }else{
            this.$message({
                message: '请选择代理商！',
                type: 'warning'
            });
          }
            
        },
        //全部分配
        async allFenPeiFn(){
            let paramsObj={
                agentId:localStorage.getItem("agentid"),
                userid:localStorage.getItem("userid"),
                username:JSON.parse(localStorage.getItem("userLoginInfo")).username
            };
            
            let startCardNo={startCardNo:this.formAllInfo.startCard}
            let endCardNo={endCardNo:this.formAllInfo.endCard}
            paramsObj={...paramsObj,...startCardNo,...endCardNo};
            console.log(paramsObj)
            try {
                const data = await this.$axios.post(
                "/fr/USIM/AllocationAllAgent",
                this._qs.stringify(paramsObj),
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
        //单个分配
        fenPei(id){
            console.log(id)
        },
        handleSizeChange(data) {
            this.pageSize = data;
            this.currentPage = 1;
        },
        handleCurrentChange(data) {
            this.currentPage = data;
        },
    }
}
</script>

<style scoped>

</style>