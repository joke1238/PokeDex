<template>
  <div class="chart-container">
    <div ref="chartRef" class="echart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
const chartInstance = ref(null)

const regionLevels = {
  神奥: [20, 26, 29, 34, 37, 43, 46, 52, 60, 60, 100],
  合众: [20, 24, 27, 31, 35, 38, 43, 46, 56, 56, 100],
  丰源: [20, 24, 28, 33, 35, 38, 44, 48, 58, 58, 100],
  关都: [20, 26, 32, 37, 46, 47, 50, 55, 62, 62, 100],
  城都: [20, 24, 29, 32, 37, 39, 41, 46, 48, 55, 100]
}

// 配色映射（等级越高颜色越亮）
const getLevelColor = level => {
  if (level >= 90) return '#e74c3c'
  if (level >= 60) return '#f39c12'
  if (level >= 40) return '#27ae60'
  return '#3498db'
}

// 图表配置
const getOption = () => ({
  backgroundColor: '#f5f7fa',
  tooltip: {
    trigger: 'item',
    backgroundColor: '#2c3e50',
    textStyle: { color: '#fff', fontSize: 13 },
    borderRadius: 6,
    formatter: params => {
      if (params.dataType === 'node') {
        return `<b>${params.name}</b>`
      } else if (params.dataType === 'edge') {
        const edge = params.data
        return `<b>${edge.source}</b> → <b>${edge.target}</b><br/>等级: ${edge.value}`
      }
      return ''
    }
  },
  series: [
    {
      type: 'graph',
      layout: 'circular',
      circular: { rotateLabel: true },
      roam: true,
      focusNodeAdjacency: true,
      symbolKeepAspect: true,
      data: [
        // 地区节点
        ...Object.keys(regionLevels).map(region => ({
          name: region,
          symbolSize: 58,
          category: 0,
          itemStyle: { color: '#2980b9' },
          label: { show: true, color: '#0f0a0e', fontSize: 16, fontWeight: '600' }
        })),
        // 等级/徽章节点
        ...[...Array(11).keys()].map(idx => {
          let name
          if (idx === 0) name = '初始'
          else if (idx > 8) name = ['一周目', '二周目'][idx - 9]
          else name = '徽章' + idx
          return {
            name,
            symbolSize: 38,
            category: 1,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 1, y2: 1,
                colorStops: [
                  { offset: 0, color: '#2ecc71' },
                  { offset: 1, color: '#f1c40f' }
                ]
              }
            },
            label: { show: true, color: '#333', fontSize: 14, fontWeight: '500' }
          }
        })
      ],
      // 边
      edges: Object.keys(regionLevels).flatMap(region => {
        return regionLevels[region].map((level, idx) => {
          let target
          if (idx === 0) target = '初始'
          else if (idx > 8) target = ['一周目', '二周目'][idx - 9]
          else target = '徽章' + idx
          return {
            source: region,
            target,
            value: level,
            lineStyle: {
              width: Math.max(1.2, level / 25), // 等级越高线越粗
              opacity: 0.8,
              color: getLevelColor(level)
            },
            label: {
              show: true,
              formatter: `${level}`,
              fontSize: 12,
              color: '#555'
            }
          }
        })
      }),
      emphasis: {
        focus: 'adjacency',
        itemStyle: { borderColor: '#e67e22', borderWidth: 3 },
        lineStyle: { width: 3, opacity: 1 }
      }
    }
  ]
})

const initChart = () => {
  if (!chartRef.value) return
  if (chartInstance.value) chartInstance.value.dispose()
  chartInstance.value = echarts.init(chartRef.value)
  chartInstance.value.setOption(getOption())
  chartInstance.value.on('click', params => {
    if (params.dataType === 'node') {
      console.log('点击节点:', params.name)
    }
    if (params.dataType === 'edge') {
      const edge = params.data
      console.log('点击边:', `${edge.source} -> ${edge.target}`, '等级:', edge.value)
    }
  })
}

const onResize = () => chartInstance.value?.resize()

onMounted(() => {
  initChart()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  chartInstance.value?.dispose()
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
.chart-container {
  border-radius: 8px;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
}

.echart {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  background: #fff;
}
</style>
