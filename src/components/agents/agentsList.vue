<template>
  <div>
    <el-select v-model="agents" filterable clearable placeholder="请选择" @change="searchData">
        <el-option :label="item.agentname" :value="item.id" v-for="item in agentsList" :key="item.id"></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
    data(){
        return {
            agents:'',
            agentsList:[],//代理商列表
        }
    },
    created(){
        this.getMyAgentFn();
    },
    mounted(){
        
    },
    methods:{
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
                this.$message.error("服务器异常，请稍后再试！");
            }
        },
        searchData(){
            this.$emit("searchDataEmit",this.agents)
        }
    }

}
</script>

<style>

</style>