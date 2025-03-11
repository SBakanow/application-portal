<script setup>
import { RouterLink, useRoute } from 'vue-router'
import logo from '@/assets/img/logo.png'

const isActiveLink = (routePath) => {
  const route = useRoute()
  return route.path === routePath
}
</script>

<template>
  <nav class="new-navbar">
    <div class="mx-auto max-w-7xl sm:px-4 lg:px-4">
      <div class="flex h-15 items-center justify-between">
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
              fill="#0f172b"
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
            <div class="flex space-x-4">
              <RouterLink
                :class="['nav-link', isActiveLink('/') ? 'nav-link-active' : 'nav-link']"
                to="/"
              >
                Home
              </RouterLink>
              <RouterLink
                :class="[
                  'nav-link',
                  isActiveLink('/applications') ? 'nav-link-active' : 'nav-link',
                ]"
                to="/applications"
              >
                Applications
              </RouterLink>
              <RouterLink
                :class="[
                  'nav-link',
                  isActiveLink('/applications/add') ? 'nav-link-active' : 'nav-link',
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
.new-navbar {
  background-color: rgba(255, 255, 255, 0.75);
  color: black;
  width: 50dvw;
  padding: 0 2rem;
  margin-inline: auto;
  position: sticky;
  top: 1rem;
  z-index: 1000;
  border-radius: 100vw;
  backdrop-filter: blur(1rem);

  box-shadow:
    inset 0 0 0.5rem hsl(0 0% 100% / 0.1),
    0 0 0.75rem hsl(0 0% 0% / 0.3);
}

.nav-link {
  position: relative;
  margin: 8px 20px 8px 20px;
  text-decoration: none;
  letter-spacing: 0.5px;
  font-weight: 600;
  color: rgba(0, 0, 0, 1);
  transition: all 0.3s ease;
}

.nav-link:nth-last-child(1) {
  margin: 8px 0px 8px 20px;
}

.nav-link:after {
  content: '';
  position: absolute;
  background-color: rgba(15, 23, 43, 0.452);
  height: 4px;
  width: 0;
  left: 0;
  bottom: -2px;
  transition: 0.3s ease;
}

.nav-link-active:after {
  content: '';
  position: absolute;
  background-color: rgb(15, 23, 43);
  height: 4px;
  width: 100%;
  left: 0;
  bottom: -2px;
}

.nav-link:hover:after {
  width: 100%;
}
</style>
