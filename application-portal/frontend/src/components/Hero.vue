<script setup>
defineProps({
  title: {
    type: String,
    default: 'Elevate your Application Process',
  },
  subtitle: {
    type: String,
    default: 'Organize Job Applications to stay up to date',
  },
})
</script>

<template>
  <section class="hero fle justify-center">
    <div class="pt-40 text-center">
      <h1 class="text-5xl font-extrabold text-black sm:text-6xl md:text-6xl">{{ title }}</h1>
      <p class="my-8 text-2xl text-black">{{ subtitle }}</p>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 70dvh;
  border-bottom-left-radius: 60px;
  border-bottom-right-radius: 60px;
}
</style>
