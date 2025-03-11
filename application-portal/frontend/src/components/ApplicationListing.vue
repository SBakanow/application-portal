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
  <RouterLink :to="'/applications/' + application.id">
    <div class="card bg-white rounded-xl shadow-md relative">
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
                  px-3
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
            @click.prevent="toggleFullDescription"
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
          <div class="text-gray-600">{{ application.Company.name }}</div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.card:hover::after{
  --angle: 0deg;
  content: '';
  position: absolute;
  inset: -5px;
  background-image: conic-gradient(from var(--angle), transparent 50%, rgb(15, 23, 43));
  z-index: -1;
  border-radius: 16px;
  animation: 4s spin linear infinite;
}


@keyframes spin {
  from {
    --angle: 0deg;
  }
  to {
    --angle: 360deg;
  }
}
</style>
