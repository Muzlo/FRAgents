<template>
  <div class="grid-content" ref="echart">lineBar</div>
</template>

<script>
export default {
  props: {
    lineBarData:{
      type:Array
    }
  },
  data() {
    return {};
  },
  created() {

  },
  mounted() {
    this.echartLineBarFn(this.lineBarData);
  },
  methods: {

    echartLineBarFn(data) {
      var keyData=[]
      var keyText=""
      data.forEach(item=>{
        keyData.push(item.name)
        keyText+=item.name+"与"
      })
      keyText=keyText.substring(0,keyText.length-1)
      
      var echart = this.$echarts.init(this.$refs.echart);
      let option = {
        title: {
          text: keyText,
          textStyle: {
            fontSize: 14
          },
          x: "center",
          y: "2%"
        },
        backgroundColor: "#f4f4f4",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            label: {
              show: true
            }
          }
        },
        legend: {
          data:keyData,
          top: "10%",
          orient: "horizontal" //horizontal vertical
        },
        dataZoom: [{
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            left: '9%',
            bottom: -5,
            start: 10,
            end: 90 //初始化滚动条
        }],
        xAxis: {
          data: ["一月", "二月", "三月", "四月", "五月", "六月","七月","八月","九月","十月","十一月","十二月"],
          axisLine: {
            show: false //隐藏X轴轴线
          },
          axisTick: {
            show: false //隐藏X轴刻度
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#000" //X轴文字颜色
            }
          },
          axisLine: {
            lineStyle: {
              color: "#000"
            }
          }
        },
        yAxis: [
          {
            name: "销量",
            type: "value",
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#333"
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#333"
              }
            }
          },
          {
            name: "收入",
            type: "value",

            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#333"
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#333"
              }
            }
          }
        ],
        series: [
          {
            name: "销量",
            type: "line",
            yAxisIndex: 0,
            smooth: true, //平滑曲线显示
            showAllSymbol: true, //显示所有图形。
            symbol: "circle", //标记的图形为实心圆
            symbolSize: 10, //标记的大小
            itemStyle: {
              //折线拐点标志的样式
              color: "#058cff"
            },
            lineStyle: {
              color: "#058cff"
            },
            areaStyle: {
              color: "rgba(5,140,255, 0.2)"
            },
            data: this.lineBarData[1].list
          },
          {
            name: "收入",
            type: "bar",
            barWidth: 20,
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#00FFE3"
                  },
                  {
                    offset: 1,
                    color: "#4693EC"
                  }
                ]),
                barBorderRadius: [10, 10, 0, 0]
              }
            },
            data: this.lineBarData[0].list
          }
        ]
      };
      echart.setOption(option);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
