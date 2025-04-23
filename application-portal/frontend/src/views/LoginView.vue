<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import axios from 'axios'

const username = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    const response = await axios.post(
      '/api/auth/login',
      {
        username: username.value,
        password: password.value,
      },
      { withCredentials: true },
    )
    router.push({ name: 'home' })
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>

<template>
  <section>
    <div class="container m-auto max-w-150 py-20">
      <div class="bg-white px-6 py-8 mb-4 shadow-md rounded-md m-4 md:m-0">
        <div>
          <h2 class="text-3xl text-center font-semibold mb-8">Login</h2>
          <form @submit.prevent="handleLogin">
            <div class="mb-4">
              <label for="username" class="block text-gray-700 font-bold text-sm mb-2"
                >Username</label
              >
              <input
                v-model="username"
                id="username"
                name="username"
                placeholder="Username"
                class="shadow-md outline-0 rounded w-full py-2 px-3 mb-2"
                required
              />
            </div>
            <div class="mb-4">
              <label for="password" class="block text-gray-700 font-bold text-sm mb-2"
                >Password</label
              >
              <input
                v-model="password"
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                class="shadow-md outline-0 rounded w-full py-2 px-3 mb-2"
                required
              />
            </div>
            <button
              class="button bg-slate-800 hover:bg-slate-900 text-white font-bold mt-4 py-2 px-4 rounded-lg w-full focus:outline-none focus:shadow-outline mb-6"
              type="submit"
            >
              Login
            </button>
            <RouterLink to="/register" class="text-cyan-600 hover:text-cyan-700">
              No account yet? Register here
            </RouterLink>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
