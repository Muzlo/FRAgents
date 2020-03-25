<template>
  <div class="home-wrapper">
    <el-row :gutter="20">
      <el-col :span="12">
        <pie :pieData="echarts1Data"/>
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
      echarts1Data:[
        {
          value: 3661,
          name: "未激活"
        },
        {
          value: 5713,
          name: "已激活"
        },
        {
          value: 9938,
          name: "已停用"
        },
        {
          value: 17623,
          name: "网卡总量"
        },
        {
          value: 3299,
          name: "已过期"
        }
      ],
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

  },
  methods:{
 
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