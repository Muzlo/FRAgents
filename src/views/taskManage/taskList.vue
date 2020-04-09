<template>
  <div>
        <el-form ref="formSearchTpye1" :inline="true" :model="formAllInfo" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="状态">
                <el-select :clearable="true" v-model="formAllInfo.taskStatus" filterable placeholder="请选择">
                  <el-option label="待处理" value="0"></el-option>
                  <el-option label="处理中" value="1"></el-option>
                  <el-option label="已处理" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="开始日期">
                <el-date-picker
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  v-model="formAllInfo.fromDate"
                ></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="结束日期">
                <el-date-picker
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  v-model="formAllInfo.toDate"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="4" :offset="10">
              <el-button type="primary" @click="taskSearchFn">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-divider></el-divider>

    <el-table  border  :data="tableList.slice((currentPage-1)*pageSize,currentPage*pageSize)" :stripe="true" style="width: 100%">
      <el-table-column prop="taskName" label="任务类型" width="180" fixed></el-table-column>

      <el-table-column prop="taskCrtTime" label="创建时间" width="180"></el-table-column>
      <el-table-column prop="taskEndTime" label="完成时间" width="180"></el-table-column>
      <el-table-column prop="taskResult" label="执行结果" width="180"></el-table-column>
      <el-table-column width="180" label="文件下载">
        <template v-slot="scope">
          <a class="downLoad" v-if="scope.row.taskDownUrl" :href="scope.row.taskDownUrl">下载</a>
        </template>
      </el-table-column>



      <el-table-column align="right" width="200" fixed="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="keySearch"
            size="mini"
            placeholder="输入任务类型搜索"/>
        </template>

        <template slot-scope="scope">

          <el-button size="mini" type="warning" @click="delList(scope.row.id,'restTask','重启')">重启</el-button>
  
          <el-button size="mini" type="danger" @click="delList(scope.row.id,'delTask','删除')">删除</el-button>

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
      name:"taskList",
      data() {
        return {
          formAllInfo:{},
          tableData:[],
          currentPage: 1, //当前第一页
          pageSize:30, //默认每页1条数据
          pageSizes:[30,50,100], //设置每页显示多少条
          keySearch:"",

        }
      },
      computed:{
          //复制一份表格数据
        tableList() {
            return this.tableData.filter(item => {
                if (item.taskName.includes(this.keySearch)) {
                    return item;
                }
                this.currentPage = 1;
            });
        }
      },
      components:{pagination},
      mounted(){

      },
      methods:{
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
        delList(id,url,txt){
          let delTaskFn=async ()=>{
            let paramsObj={
              taskId:id
            }
            try {
                const data = await this.$axios.post(
                "/fr/Task/"+url,
                this._qs.stringify(paramsObj),
                );
                if(data.errcode==0){
                    this.$message.success(data.errmsg);
                }else{
                    this.$message.error(data.errmsg);
                }
            } catch (err) {
                console.log(err);
                this.$message.error("服务器异常，请稍后再试！");
            }

          }
          this.confirmFn(txt,delTaskFn);
        },
        handleSizeChange(data) {
            this.pageSize = data;
            this.currentPage = 1;
        },
        handleCurrentChange(data) {
            this.currentPage = data;
        },
        async taskSearchFn(){
            let paramsObj={
                userId :localStorage.getItem("userid")
            }
            paramsObj={...paramsObj,...this.formAllInfo}
            try {
                const data = await this.$axios.post(
                "/fr/Task/task",
                this._qs.stringify(paramsObj),
                );
                if(data.errcode==0){
                    this.tableData=data.data.data;
                }else{
                    this.$message.error(data.errmsg);
                }
            } catch (err) {
                console.log(err);
                this.$message.error("服务器异常，请稍后再试！");
            }
        },
      }

    }
</script>

<style scoped>
  .downLoad{color: #333;}
</style>