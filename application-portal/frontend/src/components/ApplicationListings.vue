<script setup>
import { RouterLink } from 'vue-router'
import ApplicationListing from '@/components/ApplicationListing.vue'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import SkeletonApplicationListing from './SkeletonApplicationListing.vue'
import Modal from './Modal.vue'
import Filter from './Filter.vue'
import { getApplicationsQuery } from '@/graphql/queries'
import { useQuery } from '@vue/apollo-composable'
import DownloadCsv from './DownloadCsv.vue'
import { useAuthStore } from '@/store/authStore'

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

const authStore = useAuthStore()
const user = authStore.user.username

const { result, loading } = useQuery(getApplicationsQuery, { user })

const filters = ref({
  type: [],
  status: [],
  minSalary: 30000,
})

const searchQuery = ref('')

const modal = ref()

const filteredApplications = computed(() => {
  return result.value?.applications.filter((app) => {
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
      app.company.name.toLowerCase().includes(searchQuery.value.toLowerCase())

    return typeMatches && statusMatches && salaryMatches && searchMatches
  })
})

const handleClickOutside = (event) => {
  if (!modal.value) return
  const { top, left, width, height } = modal.value.$el.getBoundingClientRect()
  if (
    modal.value.visible &&
    !(
      left <= event.clientX &&
      event.clientX <= left + width &&
      top <= event.clientY &&
      event.clientY <= top + height
    )
  ) {
    modal.value.cancel()
  }
}

onMounted(async () => {
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
            @click="(event) => $refs.modal.show(event.currentTarget)"
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
        <DownloadCsv />
      </div>
      <div v-if="loading" class="text-center text-gray-500 py-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <SkeletonApplicationListing
            v-for="_ in filteredApplications?.slice(0, limit || filteredApplications?.length)"
          />
        </div>
      </div>
      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <ApplicationListing
            v-for="application in filteredApplications?.slice(
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
