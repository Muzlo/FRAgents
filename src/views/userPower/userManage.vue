<template>
<div class="clearfix">
    <div class="clearfix">
        <el-button type="primary" size="mini" class="fr" @click="newUser">新增用户</el-button>
    </div>
    <el-divider>下级用户</el-divider>
    
    <el-table
        border
        :data="tableList.slice((currentPage-1)*pageSize,currentPage*pageSize)" 
        style="width: 100%">




        <el-table-column label="用户名称" prop="username" width="100" align="center"></el-table-column>
        <el-table-column label="所属代理商" prop="agentname" width="250" align="center"></el-table-column>
        <el-table-column label="用户状态" prop="status" width="100" align="center"></el-table-column>
        <el-table-column label="用户类型" prop="usertype" width="100" align="center"></el-table-column>
        <el-table-column label="在线与否" prop="online" width="100" align="center"></el-table-column>
        <el-table-column label="最后登陆时间" prop="lastlogintime" width="200" align="center"></el-table-column>


        <el-table-column min-width="180" align="right" fixed="right">
        <template slot="header" slot-scope="scope">
            <el-input
            v-model="keySearch"
            size="mini"
            placeholder="输入用户名称搜索"/>
        </template>
        <template slot-scope="scope">
            <el-button
            size="mini"
            type="warning"
            @click="del(scope.row.id,url.resetUrl,scope.$index)">重置</el-button>

            <el-button
            size="mini"
            type="danger"
            @click="del(scope.row.id,url.delUrl,scope.$index)">删除</el-button>
            
        </template>
        </el-table-column>
    </el-table>




<pagination @handleSizeChangeEmit="handleSizeChange" @handleCurrentChangeEmit="handleCurrentChange" :total="tableData.length" :currentPage="currentPage" :pageSize="pageSize" :pageSizes="pageSizes"/>

<publicForm :otherInfo="otherInfo" :width="formWidth" :formTitle="formTitle" :form="form" :formRules="formRules" :url="url" @resetFormEmit="resetForm">
    <div slot="formContent">

        <el-form-item label="用户名称" prop="newName">
            <el-input v-model="form.newName"></el-input>
        </el-form-item>

        <el-form-item label="用户密码" prop="newPass">
            <el-input v-model="form.newPass"></el-input>
        </el-form-item>
 
        
    </div>
</publicForm>

</div>
</template>
<script>

import pagination from "../../components/pushMessage/pagination";
import publicForm from "../../components/pushMessage/publicForm";

export default {
    name: 'userManage',
    data() {
        return {
            tableData:[],
            keySearch:"",
            currentPage:1,//当前页
            pageSize:30, //默认每页1条数据
            pageSizes:[30, 50, 100],//每页显示页码
            form:{},//表单
            formWidth:"400px",
            formTitle:"新建用户",
            //验证表单
            formRules: {
                newName: [
                    { required: true, message: "不能为空", trigger: "blur" }
                ],
                newPass: [
                    { required: true, message: "不能为空", trigger: "blur" }
                ]
            },
            //接口地址
            url:{
                "addUrl":`/fr/SuperSUPro/createUser`,
                "delUrl":`/fr/SuperSUPro/delUser`,
                "resetUrl":`/fr/SuperSUPro/resetPass`,
            },
            otherInfo:'-1',//标记 '0'新增 '1'修改
        }
    },
    methods:{
        resetForm(data){
            let formOtherInfo={
                userType2:"01",
                agentId:localStorage.getItem("agentid"),
                userType:localStorage.getItem("usertype"),
                userId:localStorage.getItem("userid"),
                userName:JSON.parse(localStorage.getItem("userLoginInfo")).username,
            }
            this.form={...formOtherInfo,...data};
        },
        newUser(){
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
                let data=await this.$axios.post("/fr/SuperSUPro/userList",this._qs.stringify({
                    userName:JSON.parse(localStorage.getItem("userLoginInfo")).username,
                    userId:localStorage.getItem("userid"),
                    userType:localStorage.getItem("usertype"),
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
        del(id,url,index){
            let delFn=async ()=>{
                try{
                    let data=await this.$axios.post(url,this._qs.stringify({
                        userName:JSON.parse(localStorage.getItem("userLoginInfo")).username,
                        userId:localStorage.getItem("userid"),
                        id:id
                    }))
                    data.errcode==0?this.$message.success(data.errmsg):this.$message.error(data.errmsg);
                    if(url.includes("delUser")){
                        //this.tableData.splice(index,1);
                    }
                }catch(err){
                    this.$message.error("服务器异常，请稍后再试！");
                }
            }
            if(url.includes("delUser")){
                this.confirmFn("删除",delFn);
            }else if(url.includes("resetPass")){
                this.confirmFn("重置",delFn);
            }
            
            
        }
    },
    created(){
        this.getTableData();
        let formOtherInfo={
            userType2:"01",
            agentId:localStorage.getItem("agentid"),
            userType:localStorage.getItem("usertype"),
            userId:localStorage.getItem("userid"),
            userName:JSON.parse(localStorage.getItem("userLoginInfo")).username,
        }
        this.form={...formOtherInfo,...this.form};
    },
    computed:{
        tableList(){
            return this.tableData.filter(item=>{
               if(item.username.includes(this.keySearch)){
                   return item;
               }
               this.currentPage = 1;
            })
        }
    },
    components:{pagination,publicForm}
}



</script>

<style scoped>
.v-modal{
    z-index: 100 !important;
}
</style>