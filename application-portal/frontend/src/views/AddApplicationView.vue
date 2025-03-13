<script setup>
import router from '@/router'
import { reactive } from 'vue'
import { useToast } from 'vue-toastification'
import CompanyForm from '@/components/CompanyForm.vue'
import ApplicationForm from '@/components/ApplicationForm.vue'
import axios from 'axios'

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
</script>

<template>
  <section>
    <div class="container m-auto max-w-2xl py-20">
      <div class="bg-white px-6 py-8 mb-4 shadow-md rounded-md m-4 md:m-0">
        <form @submit.prevent="handleSubmit">
          <h2 class="text-3xl text-center font-semibold mb-8">Add Application</h2>
          <h3 class="text-2xl mb-5">Application Info</h3>
          <ApplicationForm :application="form" />

          <h3 class="text-2xl mt-8 mb-5">Company Info</h3>

          <CompanyForm :company="form.Company" />

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
