<script setup>
import PieChart from './PieChart.vue'
import Map from './Map.vue'
import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { getCountByStatusQuery, getCountByTypeQuery } from '@/graphql/queries'
import { useAuthStore } from '@/store/authStore'

const authStore = useAuthStore()
const user = authStore.user.username

const fetchData = (query, key) => {
  const { result, loading, error } = useQuery(query, { user })

  return {
    data: computed(() => {
      if (loading.value) {
        console.log(`Loading ${key} data...`)
        return []
      }

      if (error.value) {
        console.error(`Error fetching ${key}:`, error.value)
        return []
      }

      return (
        result.value?.[key]?.map((item) => ({
          name: item.type || item.status,
          value: item.count,
        })) || []
      )
    }),
    legendData: computed(() => {
      return result.value?.[key]?.map((item) => item.type || item.status) || []
    }),
  }
}

const { data: typeSeriesData, legendData: typeLegendData } = fetchData(
  getCountByTypeQuery,
  'applicationCountByType',
)
const { data: statusSeriesData, legendData: statusLegendData } = fetchData(
  getCountByStatusQuery,
  'applicationCountByStatus',
)
</script>

<template>
  <section class="px-4">
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
