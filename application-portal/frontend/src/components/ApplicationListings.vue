<script setup>
import { RouterLink } from 'vue-router'
import ApplicationListing from '@/components/ApplicationListing.vue'
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import SkeletonApplicationListing from './SkeletonApplicationListing.vue'
import Modal from './Modal.vue'
import Filter from './Filter.vue'
import axios from 'axios'

defineProps({
  limit: Number,
  showButton: {
    type: Boolean,
    default: false,
  },
  showSearch: {
    type: Boolean,
    default: true,
  },
})
const state = reactive({
  applications: [],
  isLoading: true,
})

const filters = ref({
  type: [],
  status: [],
  minSalary: 30000,
})

const searchQuery = ref('')

const modal = ref()

const showModal = () => {
  modal.value.show()
}

const filteredApplications = computed(() => {
  return state.applications.filter((app) => {
    const typeMatches =
      filters.value.type.length === 0 ||
      filters.value.type.some((type) => app.type.toLowerCase() === type.toLowerCase())

    const statusMatches =
      filters.value.status.length === 0 ||
      filters.value.status.some((status) => app.status.toLowerCase() === status.toLowerCase())

    const salaryMatches = app.minSalary >= filters.value.minSalary

    const searchMatches =
      !searchQuery.value ||
      app.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      app.location.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      app.Company.name.toLowerCase().includes(searchQuery.value.toLowerCase())

    return typeMatches && statusMatches && salaryMatches && searchMatches
  })
})

const handleClickOutside = (event) => {
  if (!modal.value) return
  const rect = modal.value.$el.getBoundingClientRect()
  const isInDialog =
    rect.top <= event.clientY &&
    event.clientY <= rect.top + rect.height &&
    rect.left <= event.clientX &&
    event.clientX <= rect.left + rect.width
  if (modal.value.visible && !isInDialog) {
    modal.value.cancel()
  }
}

const csv = ref()

const downloadCSV = async () => {
  try {
    const response = await axios.get('/api/applications-csv')
    csv.value = await response.data
  } catch (error) {
    console.error('Error downloading CSV: ', error)
  } finally {
    const blob = new Blob([csv.value], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const hiddenElement = document.createElement('a')
    hiddenElement.href = url
    hiddenElement.download = 'applications.csv'
    hiddenElement.click()
    URL.revokeObjectURL(url)
  }
}

onMounted(async () => {
  try {
    const response = await axios.get('/api/applications')
    state.applications = response.data
  } catch (error) {
    console.error('Error fetching applications: ', error)
  } finally {
    state.isLoading = false
  }
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
  <section class="px-4 py-10">
    <div class="container-xl lg:container m-auto">
      <div class="flex justify-between items-center">
        <div v-if="showSearch" class="relative w-100">
          <input
            v-model="searchQuery"
            id="search"
            type="search"
            class="search bg-white block w-full p-4 ps-10 text-sm text-gray-900 shadow-md rounded-full outline-0"
            placeholder="Search Title, Location or Company..."
            required
          />
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <i class="pi pi-search text-gray-500"></i>
          </div>
          <button
            @click="showModal"
            class="filter absolute end-[-3.8rem] bottom-0.5 rounded-full shadow-md bg-white w-12 h-12 flex justify-center items-center cursor-pointer"
          >
            <i
              :class="[
                'pi',
                filters.type.length <= 0 && filters.status.length <= 0 && filters.minSalary == 30000
                  ? 'pi-filter'
                  : 'pi-filter-fill',
                'text-gray-500',
              ]"
            ></i>
          </button>
          <Modal id="myDialog" ref="modal" hideConfirm dialogText="Add Filter">
            <Filter :filters="filters" />
          </Modal>
        </div>
        <div>
          <button
            title="Download CSV"
            @click.prevent="downloadCSV"
            class="button bg-slate-800 hover:bg-slate-900 rounded-full shadow-md w-10 h-10 flex items-center justify-center cursor-pointer"
          >
            <i class="pi pi-download text-lg text-white"></i>
          </button>
        </div>
      </div>
      <div v-if="state.isLoading" class="text-center text-gray-500 py-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <SkeletonApplicationListing
            v-for="_ in filteredApplications.slice(0, limit || filteredApplications.length)"
          />
        </div>
      </div>
      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <ApplicationListing
            v-for="application in filteredApplications.slice(
              0,
              limit || filteredApplications.length,
            )"
            :key="application.id"
            :application="application"
          >
            {{ application.title }}
          </ApplicationListing>
        </div>
      </div>
    </div>
  </section>
  <section v-if="showButton" class="m-auto max-w-sm my-10 px-6">
    <RouterLink
      class="button block bg-slate-800 text-white text-center py-4 px-6 rounded-lg hover:bg-slate-900"
      to="/applications"
    >
      View All Applications
    </RouterLink>
  </section>
</template>

<style scoped>
.search .filter {
  transition: box-shadow 0.25s;
}

.search:focus-within {
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.75);
}
.filter:focus-within {
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.75);
}
</style>
