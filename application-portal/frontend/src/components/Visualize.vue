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
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 container-xl lg:container m-auto pb-70">
      <div
        class="bg-slate-900 border rounded-2xl flex flex-col justify-center items-center gap-6 py-4 px-4"
      >
        <h1 class="text-white font-semibold text-5xl">Application Count By Type</h1>
        <p class="text-white text-2xl">
          Shows all Applications (Remote / Full-Time / Part-Time / Internship)
        </p>
      </div>
      <PieChart :legend="typeLegendData" :data="typeSeriesData" legendPosition="right" />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 container-xl lg:container m-auto pb-70">
      <PieChart :legend="statusLegendData" :data="statusSeriesData" rose />
      <div
        class="bg-slate-900 border rounded-2xl flex flex-col justify-center items-center gap-6 py-4 px-4"
      >
        <h1 class="text-white font-semibold text-5xl">Application Count By Status</h1>
        <p class="text-white text-2xl">
          Shows all Applications (Pending / Interview / Accepted / Rejected)
        </p>
      </div>
    </div>
    <div
      class="bg-slate-900 border rounded-2xl flex flex-col justify-center items-center container-xl lg:container m-auto"
    >
      <h1 class="text-5xl text-white font-semibold pt-12 pb-6">Applications By Location</h1>
      <p class="text-white text-2xl">Shows all Applications based on the location in Germany</p>
      <Map class="my-14" />
    </div>
  </section>
</template>
