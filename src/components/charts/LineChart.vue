<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps<{
  labels: string[]
  data: number[]
  datasetLabel?: string
}>()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.datasetLabel || 'Data',
      data: props.data,
      fill: true,
      borderColor: '#345cff',
      backgroundColor: 'rgba(52, 92, 255, 0.1)',
      tension: 0.35,
      pointRadius: 4
    }
  ]
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1 }
    }
  }
}
</script>

<template>
  <Line :data="chartData" :options="options" />
</template>
