<script setup>
import { RouterLink } from 'vue-router'
import { ref, computed } from 'vue'

const props = defineProps({
  application: Object,
})

const showFullDescription = ref(false)
const truncatedDescription = computed(() => {
  let description = props.application.description
  if (!showFullDescription.value && description.length >= 90) {
    description = description.substring(0, 90) + '...'
  }
  return description
})

const toggleFullDescription = () => {
  showFullDescription.value = !showFullDescription.value
}

const statusColors = {
  Pending: 'bg-slate-800',
  Interview: 'bg-orange-400',
  Accepted: 'bg-[#008000]',
  Rejected: 'bg-[#ff0000]',
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-md relative">
    <div class="p-4">
      <div class="mb-6">
        <div class="flex flex-row justify-between items-center">
          <div class="text-gray-600 my-2">{{ application.type }}</div>
          <div
            :class="`
                  ${statusColors[application.status]} 
                  text-white
                  rounded-full
                  shadow-md
                  flex
                  items-center
                  justify-center
                  px-2.5
                  py-1.5
                  text-sm
                `"
          >
            {{ application.status }}
          </div>
        </div>
        <h3 class="text-xl font-bold">{{ application.title }}</h3>
      </div>
      <div class="mb-5">
        <div>{{ truncatedDescription }}</div>
        <button
          v-show="application.description.length >= 90"
          @click="toggleFullDescription"
          class="text-cyan-600 hover:text-cyan-700 mb-5"
        >
          {{ showFullDescription ? 'Less' : 'More' }}
        </button>
      </div>
      <h3 class="text-cyan-600 mb-2">
        {{ application.minSalary / 1000 }}K - {{ application.maxSalary / 1000 }}K €/Year
      </h3>

      <div class="border border-gray-100 mb-5"></div>

      <div class="flex flex-col lg:flex-row justify-between mb-4">
        <div class="text-orange-700 mb-3">
          <i class="pi pi-map-marker text-orange-700"></i>
          {{ application.location }}
        </div>
        <RouterLink
          :to="'/applications/' + application.id"
          class="button h-[36px] bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-center text-sm"
          >Read More
        </RouterLink>
      </div>
    </div>
  </div>
</template>
