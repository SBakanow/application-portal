<script setup>
import PieChart from './PieChart.vue'
import Map from './Map.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const typeLegendData = ref([])
const typeSeriesData = ref([])

const statusLegendData = ref([])
const statusSeriesData = ref([])

const fetchCountByType = async () => {
  try {
    const response = await axios.get('/api/applications-count-by-type')
    typeLegendData.value = response.data.map((app) => {
      return app.type
    })
    typeSeriesData.value = response.data.map((app) => {
      return { value: app.count, name: app.type }
    })
  } catch (error) {
    console.error('Error fetching applications: ', error)
  }
}

const fetchCountByStatus = async () => {
  try {
    const response = await axios.get('/api/applications-count-by-status')
    statusLegendData.value = response.data.map((app) => {
      return app.status
    })
    statusSeriesData.value = response.data.map((app) => {
      return { value: app.count, name: app.status }
    })
  } catch (error) {
    console.error('Error fetching applications: ', error)
  }
}

onMounted(async () => {
  fetchCountByType()
  fetchCountByStatus()
})
</script>

<template>
  <section class="px-4 py-10">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 container-xl lg:container m-auto">
      <PieChart :legend="typeLegendData" :data="typeSeriesData" title="Application Count By Type" />
      <PieChart
        :legend="statusLegendData"
        :data="statusSeriesData"
        rose
        title="Application Count By Status"
      />
    </div>
    <div class="mt-20 flex flex-col justify-center items-center">
      <h1 class="text-2xl font-bold text-slate-700 mb-4">Applications By Location</h1>
      <Map />
    </div>
  </section>
</template>
