<template>
  <div class="home-wrapper">
    <el-row :gutter="20">
      <el-col :span="12">
        <pie :pieData="echarts1DataFn"/>
      </el-col>
      <el-col :span="12">
        <lineBar :lineBarData="echarts2Data"/>
      </el-col>
      <el-col :span="12">
        <lineEchart />
      </el-col>
      <el-col :span="12">
        <div class="grid-content" ref="echart4">
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import pie from "../components/home/pie.vue"
import lineBar from "../components/home/lineBar.vue"
import lineEchart from "../components/home/line.vue"
import { baseURL } from "../common/js/ipconfig.js";
export default {
  name: "home",
  data() {
    return {
      echarts1Data:[],
      echarts2Data:[
          {
              name:"收入",
              list: [30, 20, 36, 10, 10, 20,30, 20, 36, 10, 10, 20]
          },
          {
              name:"销量",
              list:[24, 22, 16, 18, 8, 10,30, 20, 36, 10, 10, 20]
          }
      ],
      echarts3Data:[],
    };
  },
  components:{
    pie,lineBar,lineEchart
  },
  created() {},
  mounted() {
    this.getecharts1Data();
  },
  computed:{
    echarts1DataFn:function (){
      let echarts1Data2=[];
      this.echarts1Data.forEach((item,index)=>{
        echarts1Data2[index]={
          "name":item.statusName,
          "value":Number(item.cnt)
        };
      })
      return echarts1Data2;
    },
  },
  methods:{
    async getecharts1Data(){
      try{
        const data=await this.$axios.post(`/fr/DataCount/getStatusCount`,this._qs.stringify({
          agentId:localStorage.getItem("agentid")
        }));
        this.echarts1Data=data.data;
      }catch(err){
        this.$message.error("服务器异常，请稍后再试！");
      }
        
    }
 
  }

};
</script>

<style lang="scss" scoped>
.home-wrapper {
  min-height: 100%;
}
.el-col {
  margin-bottom: 15px;
  &:last-child {
    margin-bottom: 0;
  }
  &:nth-last-child(2) {
    margin-bottom: 0;
  }
}
.grid-content {
  background: #d3dce6;
  border-radius: 4px;
  min-height: 400px;
}
</style>