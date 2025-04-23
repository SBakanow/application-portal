<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import axios from 'axios'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const router = useRouter()

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    console.error('Passwords do not match')
    return
  }

  try {
    const response = await axios.post('/api/auth/register', {
      username: username.value,
      password: password.value,
    })
    router.push({ name: 'login' })
  } catch (error) {
    console.error('Registration failed:', error)
  }
}
</script>

<template>
  <section>
    <div class="container m-auto max-w-150 py-20">
      <div class="bg-white px-6 py-8 mb-4 shadow-md rounded-md m-4 md:m-0">
        <div>
          <h2 class="text-3xl text-center font-semibold mb-8">Register</h2>
          <form @submit.prevent="handleRegister">
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
            <div class="mb-4">
              <label for="confirm-password" class="block text-gray-700 font-bold text-sm mb-2"
                >Confirm Password</label
              >
              <input
                v-model="password"
                type="password"
                id="confirm-password"
                name="confirm-password"
                placeholder="Password"
                class="shadow-md outline-0 rounded w-full py-2 px-3 mb-2"
                required
              />
            </div>
            <button
              class="button bg-slate-800 hover:bg-slate-900 text-white font-bold mt-4 py-2 px-4 rounded-lg w-full focus:outline-none focus:shadow-outline mb-6"
              type="submit"
            >
              Register
            </button>
            <RouterLink to="/login" class="text-cyan-600 hover:text-cyan-700">
              Already got an account? Login here
            </RouterLink>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
