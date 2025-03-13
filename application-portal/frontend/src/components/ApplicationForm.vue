<script setup>
import { ref } from 'vue'
const props = defineProps({
  application: Object,
  set: {
    type: Boolean,
    default: true,
  },
})

const currentInput = ref('')

const saveChip = (event) => {
  event.preventDefault()
  ;((props.set && props.application.skills.indexOf(currentInput.value) === -1) || !props.set) &&
    props.application.skills.push(currentInput.value)
  currentInput.value = ''
}

const deleteChip = (index) => {
  props.application.skills.splice(index, 1)
}
</script>

<template>
  <div class="mb-4">
    <label for="type" class="block text-gray-700 font-bold text-sm mb-2">Job Type</label>
    <select
      v-model="props.application.type"
      id="type"
      name="type"
      class="shadow-md outline-0 rounded w-full py-2 px-3 mb-2"
      required
    >
      <option value="Full-Time">Full-Time</option>
      <option value="Part-Time">Part-Time</option>
      <option value="Remote">Remote</option>
      <option value="Internship">Internship</option>
    </select>
  </div>

  <div class="mb-4">
    <label for="status" class="block text-gray-700 font-bold text-sm mb-2">Job Status</label>
    <select
      v-model="props.application.status"
      id="status"
      name="status"
      class="shadow-md outline-0 rounded w-full py-2 px-3 mb-2"
      required
    >
      <option value="Pending">Pending</option>
      <option value="Interview">Interview</option>
      <option value="Accepted">Accepted</option>
      <option value="Rejected">Rejected</option>
    </select>
  </div>

  <div class="mb-4">
    <label for="name" class="block text-gray-700 font-bold text-sm mb-2">Job Name</label>
    <input
      v-model="props.application.title"
      type="text"
      id="name"
      name="name"
      class="shadow-md outline-0 rounded w-full py-2 px-3 mb-2"
      placeholder="eg. Frontend Developer"
      required
    />
  </div>

  <div class="mb-4">
    <label for="location" class="block text-gray-700 font-bold text-sm mb-2"> Location </label>
    <input
      v-model="props.application.location"
      type="text"
      id="location"
      name="location"
      class="shadow-md outline-0 rounded w-full py-2 px-3 mb-2"
      placeholder="Company Location"
      required
    />
  </div>

  <div class="mb-4">
    <label for="description" class="block text-gray-700 font-bold text-sm mb-2">Description</label>
    <textarea
      v-model="props.application.description"
      id="description"
      name="description"
      class="shadow-md outline-0 rounded w-full py-2 px-3 min-h-40"
      rows="4"
      placeholder="Add any job duties, expectations, requirements, etc"
    ></textarea>
  </div>

  <div class="mb-4">
    <label for="minSalary" class="block text-gray-700 font-bold text-sm mb-2">Salary</label>
    <div class="flex space-x-4">
      <input
        v-model="props.application.minSalary"
        id="minSalary"
        name="minSalary"
        class="shadow-md outline-0 rounded w-full py-2 px-3 mb-2"
        type="text"
        inputmode="numeric"
        pattern="[0-9]+"
        placeholder="50000"
        oninput="this.value = this.value.replace(/[^0-9]/g, '')"
        required
      />
      <span>_</span>
      <input
        v-model="props.application.maxSalary"
        id="maxSalary"
        name="maxSalary"
        class="shadow-md outline-0 rounded w-full py-2 px-3 mb-2"
        type="text"
        inputmode="numeric"
        pattern="[0-9]+"
        placeholder="60000"
        oninput="this.value = this.value.replace(/[^0-9]/g, '')"
        required
      />
    </div>
  </div>

  <div class="mb-4">
    <label for="link" class="block text-gray-700 font-bold text-sm mb-2">Link</label>
    <input
      v-model="props.application.link"
      type="text"
      id="link"
      name="link"
      class="shadow-md outline-0 rounded w-full py-2 px-3 mb-2"
      placeholder="https://www.example.com"
      required
    />
  </div>
  <div class="mb-4">
    <label for="skills" class="block text-gray-700 font-bold text-sm mb-2">Skills</label>
    <input
      v-model="currentInput"
      type="text"
      id="skills"
      name="skills"
      class="shadow-md outline-0 rounded w-full py-2 px-3 mb-2"
      placeholder="Add any required skills"
      @keypress.enter="saveChip"
    />
    <div class="w-full flex flex-wrap space-x-2 pt-2">
      <div
        class="px-3 py-1 m-1 flex items-center text-sm rounded-full shadow-md bg-slate-800 text-white"
        v-for="(chip, i) of props.application.skills"
        :key="chip.label"
      >
        {{ chip }}
        <i class="pi pi-times cursor-pointer ml-2" @click="deleteChip(i)"></i>
      </div>
    </div>
  </div>
</template>
