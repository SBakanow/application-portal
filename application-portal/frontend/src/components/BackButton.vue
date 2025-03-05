<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section>
    <div class="container m-auto py-6 px-6">
      <RouterLink class="text-slate-800 hover:text-slate-900 flex items-center" to="/applications">
        <i class="pi pi-arrow-circle-left mr-3"></i> Back to Application Listings
      </RouterLink>
    </div>
  </section>
</template>
