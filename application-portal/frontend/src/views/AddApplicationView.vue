<script setup>
import router from '@/router'
import { ref, reactive } from 'vue'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const props = defineProps({
  set: {
    type: Boolean,
    default: true,
  },
})

const form = reactive({
  type: 'Full-Time',
  status: 'Pending',
  title: '',
  description: '',
  minSalary: null,
  maxSalary: null,
  location: '',
  link: '',
  skills: [],
  Company: {
    name: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
  },
})

const toast = useToast()
const toastOptions = {
  position: 'top-center',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: false,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: 'button',
  icon: true,
  rtl: false,
}

const geoCodeCity = async (cityName) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: cityName,
        format: 'json',
        limit: 1,
      },
    })

    if (response.data.length > 0) {
      const city = response.data[0]
      const lat = parseFloat(city.lat)
      const lon = parseFloat(city.lon)

      return [lat, lon]
    } else {
      console.error('City not found')
      return null
    }
  } catch (error) {
    console.error('Error fetching geocode: ', error)
    return null
  }
}

const handleSubmit = async () => {
  const newApplication = {
    type: form.type,
    status: form.status,
    title: form.title,
    description: form.description,
    minSalary: form.minSalary,
    maxSalary: form.maxSalary,
    location: form.location,
    latlong: JSON.stringify(await geoCodeCity(form.location)),
    link: form.link,
    skills: JSON.stringify(form.skills),
    Company: {
      name: form.Company.name,
      description: form.Company.description,
      contactEmail: form.Company.contactEmail,
      contactPhone: form.Company.contactPhone,
    },
  }

  try {
    const response = await axios.post('/api/applications', newApplication)
    toast.success('Application added successfully', toastOptions)
    router.push(`/applications/${response.data.id}`)
  } catch (error) {
    console.error('Error fetching applications: ', error)
    toast.error('Application could not be added', toastOptions)
  }
}

const currentInput = ref('')

const saveChip = (event) => {
  event.preventDefault()
  ;((props.set && form.skills.indexOf(currentInput.value) === -1) || !props.set) &&
    form.skills.push(currentInput.value)
  currentInput.value = ''
}

const deleteChip = (index) => {
  form.skills.splice(index, 1)
}
</script>

<template>
  <section>
    <div class="container m-auto max-w-2xl py-20">
      <div class="bg-white px-6 py-8 mb-4 shadow-md rounded-md m-4 md:m-0">
        <form @submit.prevent="handleSubmit">
          <h2 class="text-3xl text-center font-semibold mb-8">Add Application</h2>
          <h3 class="text-2xl mb-5">Application Info</h3>
          <div class="mb-4">
            <label for="type" class="block text-gray-700 font-bold mb-2 text-sm">Job Type</label>
            <select
              v-model="form.type"
              id="type"
              name="type"
              class="rounded w-full shadow-md py-2 px-3 outline-0"
              required
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Remote">Remote</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div class="mb-4">
            <label for="status" class="block text-gray-700 font-bold text-sm mb-2"
              >Job Status</label
            >
            <select
              v-model="form.status"
              id="status"
              name="status"
              class="shadow-md outline-0 rounded w-full py-2 px-3"
              required
            >
              <option value="Pending">Pending</option>
              <option value="Interview">Interview</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div class="mb-4">
            <label for="name" class="block text-gray-700 font-bold text-sm mb-2"
              >Job Listing Name</label
            >
            <input
              v-model="form.title"
              type="text"
              id="name"
              name="name"
              class="shadow-md rounded w-full py-2 px-3 mb-2 outline-0"
              placeholder="eg. Frontend Developer"
              required
            />
          </div>
          <div class="mb-4">
            <label for="description" class="block text-gray-700 font-bold text-sm mb-2"
              >Description</label
            >
            <textarea
              v-model="form.description"
              id="description"
              name="description"
              class="rounded w-full py-2 px-3 outline-0 shadow-md"
              rows="4"
              placeholder="Add any job duties, expectations, requirements, etc"
            ></textarea>
          </div>

          <div class="mb-4">
            <label for="minSalary" class="block text-gray-700 font-bold text-sm mb-2">Salary</label>
            <div class="flex space-x-4">
              <input
                v-model="form.minSalary"
                id="minSalary"
                name="minSalary"
                class="shadow-md outline-0 rounded w-full py-2 px-3"
                type="text"
                inputmode="numeric"
                pattern="[0-9]+"
                placeholder="50000"
                oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                required
              />
              <span>_</span>
              <input
                v-model="form.maxSalary"
                id="maxSalary"
                name="maxSalary"
                class="shadow-md outline-0 rounded w-full py-2 px-3"
                type="text"
                inputmode="numeric"
                pattern="[0-9]+"
                placeholder="60000"
                oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                required
              />
            </div>
          </div>

          <div class="mb-4">
            <label for="location" class="block text-gray-700 font-bold text-sm mb-2">
              Location
            </label>
            <input
              v-model="form.location"
              type="text"
              id="location"
              name="location"
              class="shadow-md outline-0 rounded w-full py-2 px-3 mb-2"
              placeholder="eg. München"
              required
            />
          </div>

          <div class="mb-4">
            <label for="link" class="block text-gray-700 font-bold text-sm mb-2">Link</label>
            <input
              v-model="form.link"
              type="text"
              id="link"
              name="link"
              class="shadow-md outline-0 rounded w-full py-2 px-3 mb-2"
              placeholder="https://www.example.com"
              required
            />
          </div>

          <div class="mb-4">
            <label for="skills" class="block text-gray-700 font-bold text-sm mb-2">Skills</label>
            <input
              v-model="currentInput"
              type="text"
              id="skills"
              name="skills"
              class="shadow-md outline-0 rounded w-full py-2 px-3 mb-2"
              placeholder="Add any required skills"
              @keypress.enter="saveChip"
            />
            <div class="w-full flex flex-wrap space-x-2 mb-2">
              <div
                class="px-3 py-1 m-1 flex items-center text-sm rounded-full shadow-md bg-slate-800 text-white"
                v-for="(chip, i) of form.skills"
                :key="chip.label"
              >
                {{ chip }}
                <i class="pi pi-times cursor-pointer ml-2" @click="deleteChip(i)"></i>
              </div>
            </div>
          </div>

          <h3 class="text-2xl mt-8 mb-5">Company Info</h3>

          <div class="mb-4">
            <label for="company" class="block text-gray-700 font-bold text-sm mb-2"
              >Company Name</label
            >
            <input
              v-model="form.Company.name"
              type="text"
              id="company"
              name="company"
              class="shadow-md outline-0 rounded w-full py-2 px-3"
              placeholder="eg. Google Limited"
              required
            />
          </div>

          <div class="mb-4">
            <label for="company_description" class="block text-gray-700 font-bold text-sm mb-2"
              >Company Description</label
            >
            <textarea
              v-model="form.Company.description"
              id="company_description"
              name="company_description"
              class="shadow-md outline-0 rounded w-full py-2 px-3"
              rows="4"
              placeholder="What does the company do?"
            ></textarea>
          </div>

          <div class="mb-4">
            <label for="contact_email" class="block text-gray-700 font-bold text-sm mb-2"
              >Contact Email</label
            >
            <input
              v-model="form.Company.contactEmail"
              type="email"
              id="contact_email"
              name="contact_email"
              class="shadow-md outline-0 rounded w-full py-2 px-3"
              placeholder="recruit@google.com"
              required
            />
          </div>
          <div class="mb-4">
            <label for="contact_phone" class="block text-gray-700 font-bold text-sm mb-2"
              >Contact Phone</label
            >
            <input
              v-model="form.Company.contactPhone"
              type="tel"
              id="contact_phone"
              name="contact_phone"
              class="shadow-md outline-0 rounded w-full py-2 px-3"
              placeholder="123 4567890"
            />
          </div>

          <div>
            <button
              class="button bg-slate-800 hover:bg-slate-900 text-white font-bold mt-4 py-2 px-4 rounded-lg w-full focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Add Application
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
