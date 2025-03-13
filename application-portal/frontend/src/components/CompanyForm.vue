<script setup>
const props = defineProps({
  company: Object,
})
</script>

<template>
  <div class="mb-4">
    <label for="company" class="block text-gray-700 font-bold text-sm mb-2">company Name</label>
    <input
      v-model="props.company.name"
      type="text"
      id="company"
      name="company"
      class="shadow-md outline-0 rounded w-full py-2 px-3 mb-2"
      placeholder="eg. Google Limited"
      required
    />
  </div>

  <div class="mb-4">
    <label for="company_description" class="block text-gray-700 font-bold text-sm mb-2"
      >company Description</label
    >
    <textarea
      v-model="props.company.description"
      id="company_description"
      name="company_description"
      class="shadow-md outline-0 rounded w-full py-2 px-3"
      rows="4"
      placeholder="What does the company do?"
    ></textarea>
  </div>

  <div class="mb-4">
    <label for="contact_email" class="block text-gray-700 font-bold text-sm mb-2"
      >Contact Email</label
    >
    <input
      v-model="props.company.contactEmail"
      type="email"
      id="contact_email"
      name="contact_email"
      class="shadow-md outline-0 rounded w-full py-2 px-3 mb-2"
      placeholder="recruit@google.com"
      required
    />
  </div>
  <div class="mb-4">
    <label for="contact_phone" class="block text-gray-700 font-bold text-sm mb-2"
      >Contact Phone</label
    >
    <input
      v-model="props.company.contactPhone"
      type="tel"
      id="contact_phone"
      name="contact_phone"
      class="shadow-md outline-0 rounded w-full py-2 px-3 mb-2"
      placeholder="123 4567890"
    />
  </div>
</template>
