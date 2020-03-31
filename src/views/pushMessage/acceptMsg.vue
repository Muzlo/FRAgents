<template>
<div class="clearfix">

    <el-divider>消息列表</el-divider>
    
    <el-table
        border
        :data="tableList.slice((currentPage-1)*pageSize,currentPage*pageSize)" 
        style="width: 100%">

        <el-table-column label="消息类型" prop="msgtype" width="100" align="center">
            <template v-slot="scope">
                <el-tag v-if="scope.row.msgtype==0">普通消息</el-tag>
                <el-tag type="danger" v-else-if="scope.row.msgtype==1">系统公告</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="阅读状态" prop="readstatus" width="100" align="center">
            <template v-slot="scope">
                <el-tag type="danger" effect="dark" v-if="scope.row.readstatus==0">未读</el-tag>
                <el-tag effect="dark" v-else-if="scope.row.readstatus==1">已读</el-tag>
            </template>
        </el-table-column>

        <el-table-column label="消息标题" prop="title" width="200" align="center"></el-table-column>
        <el-table-column label="内容概览" width="200" align="center">
            <template v-slot="scope">
                {{scope.row.messagecontent | txtFilter}}
            </template>
        </el-table-column>
        <el-table-column label="发送时间" prop="senddate" width="200" align="center"></el-table-column>
       
        <el-table-column min-width="100" align="center" fixed="right">
        <template slot="header" slot-scope="scope">
            <el-input
            v-model="keySearch"
            size="mini"
            placeholder="输入消息标题搜索"/>
        </template>
        <template slot-scope="scope">
            <el-button
            size="mini"
            plain
            type="success"
            @click="read(scope.row)">查看</el-button>
            
        </template>
        </el-table-column>
    </el-table>

    <pagination @handleSizeChangeEmit="handleSizeChange" @handleCurrentChangeEmit="handleCurrentChange" :total="tableData.length" :currentPage="currentPage" :pageSize="pageSize" :pageSizes="pageSizes"/>

    <el-dialog title="消息内容" :visible.sync="dialogVisibleFn" width="30%">
        <span>{{messageInfo}}</span>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="$store.commit('dialogVisible/dialogVisibleMutations',false)">确 定</el-button>
        </span>
    </el-dialog>



</div>
</template>

<script>
import pagination from "../../components/pushMessage/pagination";
export default {
    name: 'acceptMsg',
    data() {
        return {
            tableData:[],
            keySearch:"",
            currentPage:1,//当前页
            pageSize:30, //默认每页1条数据
            pageSizes:[30, 50, 100],//每页显示页码
            messageInfo:"",//消息内容
        }
    },
    created(){
        this.getTableData();
    },
    filters:{
        txtFilter(data){
            return data.substr(0,20)+"..."
        }
    },
    components:{pagination},
    computed:{
        tableList(){
            return this.tableData.filter(item=>{
               if(item.title.includes(this.keySearch)){
                   return item;
               }
               this.currentPage = 1;
            })
        },
        dialogVisibleFn: {
            get: function() {
                return this.$store.state.dialogVisible.dialogVisible
            },
            set: function() {
                this.$store.commit('dialogVisible/dialogVisibleMutations',false)
            }
        }
    },
    methods:{
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
        },
        handleCurrentChange(val) {
            this.currentPage=val;
        },
        async getTableData(){
            try{
                let data=await this.$axios.post("/fr/Message/colleMsgList",this._qs.stringify({
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
        async read(id){
            if(id.readstatus==0){
                let data=await this.$axios.post(`/fr/Message/realMsg`,this._qs.stringify({
                    id:id.id,
                    userName:JSON.parse(localStorage.getItem("userLoginInfo")).username
                }))
                if(data.errcode==0){
                    id.readstatus=1
                }
            }
            this.messageInfo=id.messagecontent;
            this.$store.commit('dialogVisible/dialogVisibleMutations',true);
        }
    }
}
</script>

<style scoped>
.v-modal{
    z-index: 100 !important;
}
</style>