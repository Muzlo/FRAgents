<template>
  <div
    class="grid-content"
    ref="echart1"
    @mouseout="echart1TimerStart"
    @mouseover="echart1TimerEnd"
  ></div>

</template>

<script>
export default {
  props:{
    pieData:{
      type: Array,
      required: true
    },
  },
  data() {
    return {
      echartData: {
        echartDataIndex1: 1,
        echartDataIndex2: 0,
        timer: null
      }
    };
  },
  created(){},
  beforeDestroy() {
      //清除定时器
      clearInterval(this.echartData.timer);
      //console.log("beforeDestroy");
  },
  destroyed() {
      //清除定时器
      clearInterval(this.echartData.timer);
     // console.log("destroyed");
  },
  mounted() {
    this.echart1Fn(this.pieData);
    this.echartData.timer = setInterval(() => {
      this.echart1Timer();
    }, 3000);
  },
  methods: {
    echart1Fn(data) {
      var _this = this;
      var echart1 = this.$echarts.init(this.$refs.echart1);
      var keyData = [];
      var colorData = ["#86D560", "#AF89D6", "#59ADF3", "#FF999A", "#FFCC67"];
      data.forEach(item => {
        keyData.push(item.name);
      });

      let option = {
        backgroundColor: "#fff",
        title: {
          text: "网卡信息",
          x: "center",
          y: "center",
          textStyle: {
            fontWeight: "normal",
            fontSize: 16
          }
        },
        tooltip: {
          show: true,
          trigger: "item",
          formatter: "{b}: {c} ({d}%)"
        },
        legend: {
          orient: "horizontal",//horizontal vertical
          bottom: "0%",
          data: keyData
        },
        series: [
          {
            type: "pie",
            selectedMode: "single",
            radius: ["25%", "58%"],
            color: colorData,

            label: {
              normal: {
                position: "inner",
                formatter: "{d}%",

                textStyle: {
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 14
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: data
          },
          {
            type: "pie",
            radius: ["58%", "83%"],
            itemStyle: {
              normal: {
                color: "#F2F2F2"
              },
              emphasis: {
                color: "#ADADAD"
              }
            },
            label: {
              normal: {
                position: "inner",
                formatter: "{c}",
                textStyle: {
                  color: "#777777",
                  fontWeight: "bold",
                  fontSize: 14
                }
              }
            },
            data: data
          }
        ]
      };
      echart1.setOption(option);
      echart1.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: _this.echartData.echartDataIndex1
      });

      echart1.dispatchAction({
        type: "downplay",
        seriesIndex: 0,
        dataIndex: _this.echartData.echartDataIndex2
      });

      echart1.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: _this.echartData.echartDataIndex1
      });

      if (_this.echartData.echartDataIndex2 == -1) {
        echart1.dispatchAction({
          type: "downplay",
          seriesIndex: 0,
          dataIndex: this.pieData.length - 1
        });
      }
    },
    /////echart1定时器
    echart1Timer() {
      this.echartData.echartDataIndex1++;
      this.echartData.echartDataIndex2++;
      if (this.echartData.echartDataIndex1 >= this.pieData.length) {
        this.echartData.echartDataIndex1 = 0;
        this.echartData.echartDataIndex2 = -1;
      }
      this.echart1Fn(this.pieData);
    },
    /////鼠标移出
    echart1TimerStart() {
      this.echartData.timer = setInterval(() => {
        this.echart1Timer();
      }, 3000);
    },
    ////////鼠标移入
    echart1TimerEnd() {
     clearInterval(this.echartData.timer);
    }
  },
  watch:{
    pieData(newVal,oldVal){
      
    }
  }
};
</script>

<style scoped lang="scss">
</style>
