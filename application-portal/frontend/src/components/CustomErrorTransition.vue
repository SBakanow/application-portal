<script setup>
const props = defineProps({
  errorMessage: String,
})

const beforeEnter = (el) => {
  el.style.height = '0'
  el.style.opacity = '0'
}
const enter = (el, done) => {
  el.style.transition = 'height 0.4s ease, opacity 0.4s ease'
  el.style.height = el.scrollHeight + 'px'
  el.style.opacity = '1'
  el.addEventListener('transitionend', done)
}
const afterEnter = (el) => {
  el.style.height = 'auto'
}
const beforeLeave = (el) => {
  el.style.height = el.scrollHeight + 'px'
  el.style.opacity = '1'
}
const leave = (el, done) => {
  el.style.transition = 'height 0.4s ease, opacity 0.4s ease'
  el.style.height = '0'
  el.style.opacity = '0'
  el.addEventListener('transitionend', done)
}
const afterLeave = (el) => {
  el.style.height = ''
}
</script>

<template>
  <Transition
    name="fade"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <div v-if="props.errorMessage" class="text-red-500 text-sm mt-2">
      {{ props.errorMessage }}
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
