<script setup>
import { RouterLink, useRoute } from 'vue-router'
import logo from '@/assets/img/logo.png'

const isActiveLink = (routePath) => {
  const route = useRoute()
  return route.path === routePath
}
</script>

<template>
  <nav class="navbar border-b border-slate-500">
    <div class="mx-auto max-w-7xl px-2 sm:px-4 lg:px-4">
      <div class="flex h-18 items-center justify-between">
        <div class="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
          <RouterLink class="flex flex-shrink-0 items-center mr-4" to="/">
            <svg
              class="logo"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              version="1.0"
              id="Layer_1"
              width="35px"
              height="35px"
              viewBox="0 0 64 64"
              enable-background="new 0 0 64 64"
              xml:space="preserve"
              fill="#ffffff"
            >
              <g>
                <rect x="14" y="36" width="4" height="10" />
                <path
                  d="M52,47c0,0.553-0.447,1-1,1h-6c-0.553,0-1-0.447-1-1v-5H20v5c0,0.553-0.447,1-1,1h-6c-0.553,0-1-0.447-1-1   v-5H0v18c0,2.211,1.789,4,4,4h56c2.211,0,4-1.789,4-4V42H52V47z"
                />
                <rect x="46" y="36" width="4" height="10" />
                <path
                  d="M60,13H48V4c0-2.211-1.789-4-4-4H20c-2.211,0-4,1.789-4,4v9H4c-2.211,0-4,1.789-4,4v23h12v-5   c0-0.553,0.447-1,1-1h6c0.553,0,1,0.447,1,1v5h24v-5c0-0.553,0.447-1,1-1h6c0.553,0,1,0.447,1,1v5h12V17C64,14.789,62.211,13,60,13   z M42,13H22V6h20V13z"
                />
              </g>
            </svg>
          </RouterLink>
          <div class="md:ml-auto">
            <div class="flex space-x-2">
              <RouterLink
                :class="[
                  isActiveLink('/') ? 'bg-cyan-900' : 'hover:bg-gray-900 hover:text-white',
                  'text-white',
                  'rounded-md',
                  'px-3',
                  'py-2',
                ]"
                to="/"
              >
                Home
              </RouterLink>
              <RouterLink
                :class="[
                  isActiveLink('/applications')
                    ? 'bg-cyan-900'
                    : 'hover:bg-gray-900 hover:text-white',
                  'text-black',
                  'rounded-md',
                  'px-3',
                  'py-2',
                ]"
                to="/applications"
              >
                Applications
              </RouterLink>
              <RouterLink
                :class="[
                  isActiveLink('/applications/add')
                    ? 'bg-cyan-900'
                    : 'hover:bg-gray-900 hover:text-white',
                  'text-black',
                  'rounded-md',
                  'px-3',
                  'py-2',
                ]"
                to="/applications/add"
              >
                Add Application
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  --_animationStartsAfter: 9vh;
  --_animationDistance: 200px;
  --_surfaceColorStart: #f2f0ef;
  --_surfaceColorEnd: hsla(0, 0%, 0%, 0.4);
  --_textColorStart: #000000;
  --_textColorEnd: hsl(0 10% 90%);
  --_borderRadius: 0;

  --_logoAfterAnimation: block;

  padding: 0 3rem;
  margin-inline: auto;
  width: var(--_headerWidth, auto);

  color: var(--_textColorStart);
  background-color: var(--_surfaceColorStart);

  position: sticky;
  z-index: 1000;

  @supports (animation-timeline: view()) {
    top: -5rem;

    border-radius: var(--_borderRadius, 0);
    backdrop-filter: blur(0.35rem);

    animation: stickyNav linear forwards;
    animation-timeline: view();
    animation-range-start: calc(100vh + var(--_animationStartsAfter));
    animation-range-end: calc(100vh + var(--_animationStartsAfter) + var(--_animationDistance));
  }

  .logo {
    display: var(--_logoDisplay, block);
    fill: currentColor;
    margin-right: 1rem;
  }
}

@keyframes stickyNav {
  0%,
  100% {
    --_headerWidth: fit-content;
    --_logoDisplay: var(--_logoAfterAnimation);
    --_borderRadius: 100vw;
  }

  100% {
    top: 1rem;
    color: var(--_textColorEnd);
    background-color: var(--_surfaceColorEnd);
    box-shadow:
      inset 0 0 0.5rem hsl(0 0% 100% / 0.1),
      0 0 0.75rem hsl(0 0% 0% / 0.3);
  }
}
</style>
