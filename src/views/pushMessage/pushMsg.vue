<template>
<div class="clearfix">
    <div class="clearfix">
        <el-button type="primary" size="mini" class="fr" @click="newMessage">新建消息</el-button>
    </div>
    <el-divider>消息列表</el-divider>
    
    <el-table
        border
        :data="tableList.slice((currentPage-1)*pageSize,currentPage*pageSize)" 
        style="width: 100%">

        <el-table-column label="消息类型" prop="msgtype" width="100" align="center">
            <template v-slot="scope">
                <el-tag type="info" v-if="scope.row.msgtype==0">普通消息</el-tag>
                <el-tag type="warning" v-else-if="scope.row.msgtype==1">系统公告</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="消息标题" prop="title" width="200" align="center"></el-table-column>
        <el-table-column label="内容概览" prop="messagecontent" width="250" align="center"></el-table-column>
        <el-table-column label="发送时间" prop="senddate" width="200" align="center"></el-table-column>
        <el-table-column label="发送人" prop="updusername" width="120" align="center"></el-table-column>


        <el-table-column min-width="150" align="right">
        <template slot="header" slot-scope="scope">
            <el-input
            v-model="keySearch"
            size="mini"
            placeholder="输入消息标题搜索"/>
        </template>
        <template slot-scope="scope">
            <el-button
            size="mini"
            type="danger"
            @click="del(scope.row.id,scope.$index)">删除</el-button>
            
        </template>
        </el-table-column>
    </el-table>




<pagination @handleSizeChangeEmit="handleSizeChange" @handleCurrentChangeEmit="handleCurrentChange" :total="tableData.length" :currentPage="currentPage" :pageSize="pageSize" :pageSizes="pageSizes"/>

<publicForm :otherInfo="otherInfo" :width="formWidth" :formTitle="formTitle" :form="form" :formRules="formRules" :url="url" @resetFormEmit="resetForm">
    <div slot="formContent">
        <el-form-item label="消息类型" prop="msgType">
            <el-select v-model="form.msgType" placeholder="请选择" class="w100">
                <el-option
                v-for="item in messageList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="消息标题" prop="title">
            <el-input v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item label="消息内容" prop="messageContent">
            <el-input type="textarea" v-model="form.messageContent"></el-input>
        </el-form-item>
        
    </div>
</publicForm>

</div>
</template>

<script>

import pagination from "../../components/pushMessage/pagination";
import publicForm from "../../components/pushMessage/publicForm";
export default {
    name: 'pushMsg',
    data() {
        return {
            tableData:[],
            keySearch:"",
            currentPage:1,//当前页
            pageSize:30, //默认每页1条数据
            pageSizes:[30, 50, 100],//每页显示页码
            form:{},//表单
            formWidth:"400px",
            formTitle:"新建消息",
            messageList:[
                {
                    name:"普通消息",
                    value:"0"
                },
                {
                    name:"系统公告",
                    value:"1"
                }
            ],
            //验证表单
            formRules: {
                msgType: [
                    { required: true, message: "不能为空", trigger: "blur" }
                ],
                title: [
                    { required: true, message: "不能为空", trigger: "blur" }
                ],
                messageContent: [
                    { required: true, message: "不能为空", trigger: "blur" }
                ]
            },
            //接口地址
            url:{
                "addUrl":`/fr/Message/saveMessage`,
                "delUrl":`/fr/Message/delMessage`,
            },
            otherInfo:'-1',//标记 '0'新增 '1'修改
        }
    },
    methods:{
        resetForm(data){
            let formOtherInfo={
                userName:JSON.parse(localStorage.getItem("userLoginInfo")).username,
                userId:localStorage.getItem("userid"),
                agentId:localStorage.getItem("agentid")
            }
            this.form={...data,...formOtherInfo}
        },
        newMessage(){
            this.$store.commit('dialogVisible/dialogVisibleMutations',true);
            this.otherInfo='0';
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
        },
        handleCurrentChange(val) {
            this.currentPage=val;
        },
        async getTableData(){
            try{
                let data=await this.$axios.post("/fr/Message/msgList",this._qs.stringify({
                    userName:JSON.parse(localStorage.getItem("userLoginInfo")).username,
                    userId:localStorage.getItem("userid"),
                    agentId:localStorage.getItem("agentid"),
                }))
                if(data.errcode==0){
                    this.tableData=data.lst.data;
                }
            }catch(err){
                this.$message.error("服务器异常，请稍后再试！");
            }
        },
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
        del(id,index){
            let delFn=async ()=>{
                try{
                    let data=await this.$axios.post(this.url.delUrl,this._qs.stringify({
                        userName:JSON.parse(localStorage.getItem("userLoginInfo")).username,
                        userId :localStorage.getItem("userid"),
                        id:id
                    }))
                    data.errcode==0?this.$message.success(data.errmsg):this.$message.error(data.errmsg);
                    this.tableData.splice(index,1);
                }catch(err){
                    this.$message.error("服务器异常，请稍后再试！");
                }
            }
            this.confirmFn("删除",delFn);
            
            
        }
    },
    created(){
        this.getTableData();
        let formOtherInfo={
            userName:JSON.parse(localStorage.getItem("userLoginInfo")).username,
            userId:localStorage.getItem("userid"),
            agentId:localStorage.getItem("agentid")
        }
        this.form={...this.form,...formOtherInfo}
    },
    computed:{
        tableList(){
            return this.tableData.filter(item=>{
               if(item.title.includes(this.keySearch)){
                   return item;
               }
               this.currentPage = 1;
            })
        }
    },
    components:{pagination,publicForm},

}
</script>

<style scoped>
.v-modal{
    z-index: 100 !important;
}
</style>