<script setup>
import { computed } from 'vue'

const props = defineProps({
  filters: Object,
})

const thumbPosition = computed(() => {
  const value = parseInt(props.filters.minSalary, 10)
  const max = 100000
  const min = 30000
  const percentage = ((value - min) / (max - min)) * 100
  return `calc(${percentage}% - ${(percentage / 100) * 16}px)`
})

const numberWithCommas = (number) => {
  return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, '.')
}

const clearFilter = () => {
  props.filters.type = []
  props.filters.status = []
  props.filters.minSalary = 30000
}
</script>

<template>
  <div class="text-left">
    <p class="block text-gray-700 font-bold mb-2 mt-4 text-sm">Job Type</p>
    <div class="flex space-x-4">
      <div class="flex space-x-2">
        <input type="checkbox" id="full-time" value="Full-Time" v-model="props.filters.type" />
        <label for="full-time">Full-Time</label>
      </div>
      <div class="flex space-x-2">
        <input type="checkbox" id="part-time" value="Part-Time" v-model="props.filters.type" />
        <label for="part-time">Part-Time</label>
      </div>
      <div class="flex space-x-2">
        <input type="checkbox" id="remote" value="Remote" v-model="props.filters.type" />
        <label for="remote">Remote</label>
      </div>
    </div>

    <p class="block text-gray-700 font-bold mb-2 mt-4 text-sm">Status</p>
    <div class="flex space-x-4">
      <div class="flex space-x-2">
        <input type="checkbox" id="pending" value="Pending" v-model="props.filters.status" />
        <label for="pending">Pending</label>
      </div>
      <div class="flex space-x-2">
        <input type="checkbox" id="interview" value="Interview" v-model="props.filters.status" />
        <label for="interview">Interview</label>
      </div>
      <div class="flex space-x-2">
        <input type="checkbox" id="accepted" value="Accepted" v-model="props.filters.status" />
        <label for="accepted">Accepted</label>
      </div>
      <div class="flex space-x-2">
        <input type="checkbox" id="rejected" value="Rejected" v-model="props.filters.status" />
        <label for="rejected">Rejected</label>
      </div>
    </div>

    <p class="block text-gray-700 font-bold mb-2 mt-4 text-sm">Min Salary</p>
    <div class="flex space-x-4">
      <div class="w-full pt-10 relative">
        <input
          type="range"
          min="30000"
          max="100000"
          value="50000"
          step="1000"
          v-model="props.filters.minSalary"
          class="appearance-none w-full outline-none bg-slate-300 rounded-full"
        />
        <div
          class="absolute top-0.5 -ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded-full"
          :style="{ left: thumbPosition }"
        >
          {{ numberWithCommas(props.filters.minSalary) }}€
        </div>
      </div>
    </div>
    <div class="flex justify-end">
      <button
        class="button h-[36px] bg-slate-800 hover:bg-slate-900 text-white mb-4 mt-6 px-4 py-2 rounded-lg text-center text-sm"
        @click.prevent="clearFilter"
      >
        Clear
      </button>
    </div>
  </div>
</template>

<style scoped>
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 20px;
  width: 20px;
  background: rgb(29, 41, 61);
  border-radius: 50%;
  cursor: pointer;
}

input[type='range']::-moz-range-thumb {
  height: 20px;
  width: 20px;
  background: rgb(29, 41, 61);
  border-radius: 50%;
  cursor: pointer;
}
</style>
