<script setup>
import apolloClient from '@/apolloClient'
import { getApplicationsCSVQuery } from '@/graphql/queries'

const downloadCSV = async () => {
  try {
    const { data } = await apolloClient.query({
      query: getApplicationsCSVQuery,
    })

    if (!data || !data.applicationsCSV) {
      throw new Error('CSV data is empty')
    }

    const csvContent = data.applicationsCSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const hiddenElement = document.createElement('a')
    hiddenElement.href = url
    hiddenElement.download = 'applications.csv'
    hiddenElement.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading CSV:', error)
  }
}
</script>

<template>
  <button
    title="Download CSV"
    @click.prevent="downloadCSV"
    class="button bg-slate-800 hover:bg-slate-900 rounded-full shadow-md w-10 h-10 flex items-center justify-center cursor-pointer"
  >
    <i class="pi pi-download text-lg text-white"></i>
  </button>
</template>
