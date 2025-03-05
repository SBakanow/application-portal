<script setup>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import Vchart, { THEME_KEY } from 'vue-echarts'
import { ref, provide } from 'vue'
import { watch } from 'vue'

const props = defineProps({
  legend: Array,
  data: Array,
  rose: Boolean,
  title: {
    type: String,
    default: '',
  },
})

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent])

provide(THEME_KEY, 'light')

const option = ref({
  title: {
    text: props.title,
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    right: 'left',
    data: [],
  },
  series: [
    {
      name: props.title,
      type: 'pie',
      roseType: props.rose ? 'area' : null,
      radius: '55%',
      center: ['50%', '60%'],
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
})

watch(
  () => [props.legend, props.data],
  ([newLegend, newData]) => {
    option.value.legend.data = newLegend
    option.value.series[0].data = newData
  },
  { immediate: true },
)
</script>

<template>
  <Vchart class="chart" :option="option"></Vchart>
</template>

<style scoped>
.chart {
  height: 400px;
}
</style>
