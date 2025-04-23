<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

const authStore = useAuthStore()

onMounted(async () => {
  try {
    await authStore.checkAuth()
  } catch (error) {
    console.warn('Failed to initialize authentication:', error)
  }
})
</script>

<template>
  <NavBar />
  <RouterView />
</template>
