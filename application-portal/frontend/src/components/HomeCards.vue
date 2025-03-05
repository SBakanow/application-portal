<script setup>
import { RouterLink } from 'vue-router'
import Card from '@/components/Card.vue'
</script>

<template>
  <section class="py-4">
    <div class="container-xl lg:container m-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
        <Card>
          <h2 class="text-2xl font-bold">Overview</h2>
          <p class="mt-2 mb-4">Browse your job applications and start organizing today</p>
          <RouterLink
            to="/applications"
            class="inline-block bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-700"
          >
            Browse Applications
          </RouterLink>
        </Card>
        <Card bg="bg-cyan-100">
          <h2 class="text-2xl font-bold">New Application</h2>
          <p class="mt-2 mb-4">Add a new job application to stay up to date</p>
          <RouterLink
            to="/applications/add"
            class="inline-block bg-cyan-400 text-white rounded-lg px-4 py-2 hover:bg-cyan-500"
          >
            Add Application
          </RouterLink>
        </Card>
      </div>
    </div>
  </section>
</template>
