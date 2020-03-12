<template>
  <div class="grid-content" ref="echart">line</div>
</template>

<script>
export default {
  props: {

  },
  data() {
    return {};
  },
  created() {},
  mounted() {
    this.echartLineFn();
  },
  methods: {
    echartLineFn() {
      var echart = this.$echarts.init(this.$refs.echart);
      let option = {
        backgroundColor: "#fff",
        title: {
          text: "请求数",
          textStyle: {
            fontWeight: "normal",
            fontSize: 16,
            color: "#333"
          },
          left: "6%"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: "red"
            }
          }
        },
        legend: {
          icon: "rect",
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ["移动", "电信", "联通"],
          right: "4%",
          textStyle: {
            fontSize: 12,
            color: "#333"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: "#333"
              }
            },
            data: [
              "13:00",
              "13:05",
              "13:10",
              "13:15",
              "13:20",
              "13:25",
              "13:30",
              "13:35"
            ]
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "单位（%）",
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#333"
              }
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14
              }
            },
            splitLine: {
              lineStyle: {
                color: "#eee"
              }
            }
          }
        ],
        series: [
          {
            name: "移动",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 3
              }
            },
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "rgba(16,97,204, 0.3)"
                    },
                    {
                      offset: 0.8,
                      color: "rgba(17,235,210, 0)"
                    }
                  ],
                  false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: "#AF89D6"
                  },
                  {
                    offset: 1,
                    color: "#59ADF3"
                  }
                ])
              },
              emphasis: {
                color: "rgb(0,196,132)",
                borderColor: "rgba(0,196,132,0.2)",
                extraCssText: "box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);",
                borderWidth: 10
              }
            },
            data: [220, 182, 191, 134, 150, 120, 110, 125]
          },
          {
            name: "电信",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 3
              }
            },
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(205,52,42, 0.5)"
                    },
                    {
                      offset: 0.8,
                      color: "rgba(235,235,21, 0)"
                    }
                  ],
                  false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: "#86D560"
                  },
                  {
                    offset: 1,
                    color: "#FFCC67"
                  }
                ])
              },
              emphasis: {
                color: "rgb(99,250,235)",
                borderColor: "rgba(99,250,235,0.2)",
                extraCssText: "box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);",
                borderWidth: 10
              }
            },
            data: [120, 110, 125, 145, 122, 165, 122, 220]
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
