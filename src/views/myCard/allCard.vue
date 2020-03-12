<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="查询方式一" name="first">
        <el-form ref="formSearchTpye1" :inline="true" :model="formAllInfo" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="网卡类型">
                <el-select v-model="formAllInfo.cardType" filterable placeholder="请选择">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="代理商">
                <el-select v-model="formAllInfo.agents" filterable placeholder="请选择">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="网卡状态">
                <el-select v-model="formAllInfo.cardStatus" filterable placeholder="请选择">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结束日期">
                <el-date-picker
                  type="datetime"
                  value-format="yyyy-MM-dd HH-mm-ss"
                  placeholder="选择日期"
                  v-model="formAllInfo.endDate"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="号码类型">
            <el-select v-model="formAllInfo.cardType" filterable placeholder="请选择">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formAllInfo.startCard" placeholder="起始卡号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formAllInfo.endCard" placeholder="结束卡号"></el-input>
          </el-form-item>

          <el-row>
            <el-col :span="2" :offset="11">
              <el-button type="primary" style="width:100%;" @click="searchForm1">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="查询方式二" name="second">
        <el-form ref="formSearchTpye2" :model="formAllInfo2" label-width="80px">
          <el-form-item label="号码类型">
            <el-select v-model="formAllInfo2.region" filterable placeholder="请选择">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="批量查询">
            <el-input type="textarea" v-model="formAllInfo2.desc"></el-input>
          </el-form-item>

          <el-row>
            <el-col :span="2" :offset="11">
              <el-button type="primary" style="width:100%;" @click="searchForm2">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <el-divider></el-divider>
    <el-table :data="tableDataList.slice((currentPage-1)*pageSize,currentPage*pageSize)" :stripe="true" style="width: 100%">
      <el-table-column prop="date" label="日期" width="180"></el-table-column>
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入关键字搜索"/>
        </template>

        <template slot-scope="scope">

          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
  
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>

        </template>

      </el-table-column>
    </el-table>

    <el-pagination
      background
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableDataList.length">
    </el-pagination>


  </div>
</template>

<script>
export default {
  name: "allCard",
  data() {
    return {
      activeName: "first",
      formAllInfo: {},
      formAllInfo2: {},
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎1",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎1",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎1",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎1",
          address: "上海市普陀区金沙江路 1516 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎1",
          address: "上海市普陀区金沙江路 1516 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎6",
          address: "上海市普陀区金沙江路 1516 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎7",
          address: "上海市普陀区金沙江路 1516 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎8",
          address: "上海市普陀区金沙江路 1516 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎9",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
      currentPage: 1, //当前第一页
      pageSize:5, //默认每页1条数据
      pageSizes:[5,20,30], //设置每页显示多少条
      search:""
    };
  },
  methods: {
    handleEdit(index,row){
      console.log(index,row)

      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        
    },
    handleDelete(index,row){
      console.log(index,row)
    },
    handleCurrentChange(val){
      this.currentPage=val
    },
    handleClick(tab, event) {},
    searchForm1() {
      console.log(this.formAllInfo);
    },
    searchForm2() {
      console.log(this.formAllInfo2);
    }
  },
  created() {},
  computed: {
    tableDataList(){
      let search=this.search.replace(/^\s*|\s*$/g,"");
      console.log(search)
      return this.tableData.filter(item=>{
        if( item.name.indexOf(search)>-1 ){
          return item
        }
      })
    }
  },

};
</script>

<style scoped>
</style>