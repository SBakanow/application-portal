<template>
  <div class="bg-white rounded-xl shadow-md relative">
    <div class="p-4">
      <div class="mb-6">
        <div class="flex flex-row justify-between items-center">
          <div class="skeleton bg-gray-300 w-20 h-5 mt-2 mb-3"></div>
        </div>
        <h3 class="skeleton bg-gray-300 max-w-50 h-7"></h3>
      </div>
      <div class="skeleton mb-10 bg-gray-300 max-w-90 h-20"></div>
      <h3 class="skeleton bg-gray-300 max-w-25 h-5 mb-4"></h3>

      <div class="border border-gray-100 mb-5"></div>
      <h2 class="skeleton bg-gray-300 max-w-20 h-5 mb-3"></h2>
    </div>
  </div>
</template>

<style scoped>
.skeleton {
  animation: pulse-bg 1s infinite;
}

@keyframes pulse-bg {
  0% {
    background-color: #d1d5dc;
  }
  50% {
    background-color: #e8eaee;
  }
  100% {
    background-color: #d1d5dc;
  }
}
</style>
