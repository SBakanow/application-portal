<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, RouterLink, useRouter } from 'vue-router'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import BackButton from '@/components/BackButton.vue'
import { useToast } from 'vue-toastification'
import Modal from '@/components/Modal.vue'
import axios from 'axios'

const props = defineProps({
  set: {
    type: Boolean,
    default: true,
  },
})

const route = useRoute()
const router = useRouter()
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

const applicationId = route.params.id

const state = reactive({
  application: {},
  isLoading: true,
})

const deleteApplication = async () => {
  try {
    await axios.delete(`/api/applications/${applicationId}`)
    toast.success('Application deleted successfully', toastOptions)
    router.push('/applications')
  } catch (error) {
    console.error('Error deleting application: ', error)
    toast.error('Application could not be deleted', toastOptions)
  }
}

const modal = ref()

const showModal = () => {
  modal.value.show()
}

const application = reactive({
  title: '',
  type: '',
  status: '',
  description: '',
  location: '',
  minSalary: '',
  maxSalary: '',
  link: '',
  skills: [],
})

const company = reactive({
  name: '',
  description: '',
  contactEmail: '',
  contactPhone: '',
})

const applicationEditing = ref(false)
const companyEditing = ref(false)

const cancelApplicationEdit = () => {
  createApplication()
  applicationEditing.value = false
}

const cancelCompanyEdit = () => {
  createCompany()
  companyEditing.value = false
}

const pick = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (key in obj) result[key] = obj[key]
    return result
  }, {})
}

const createApplication = () => {
  const filteredApplicationData = pick(state.application, [
    'title',
    'type',
    'status',
    'description',
    'location',
    'minSalary',
    'maxSalary',
    'link',
    'skills',
  ])

  if (filteredApplicationData.skills) {
    filteredApplicationData.skills = [...filteredApplicationData.skills]
  }

  Object.assign(application, filteredApplicationData)
}

const createCompany = () => {
  const filteredCompanyData = pick(state.application.Company, [
    'name',
    'description',
    'contactEmail',
    'contactPhone',
  ])
  Object.assign(company, filteredCompanyData)
}

const handleApplicationEdit = async () => {
  const newApplication = {
    type: application.type,
    status: application.status,
    title: application.title,
    description: application.description,
    minSalary: application.minSalary,
    maxSalary: application.maxSalary,
    location: application.location,
    link: application.link,
    skills: JSON.stringify(application.skills),
  }

  try {
    const response = await axios.put(`/api/applications/${applicationId}`, newApplication)
    state.application = response.data
    toast.success('Application updated successfully', toastOptions)
    applicationEditing.value = false
  } catch (error) {
    console.error('Error updating application: ', error)
    toast.error('Application could not be updated', toastOptions)
  }
}

const handleCompanyEdit = async () => {
  const newCompany = {
    name: company.name,
    description: company.description,
    contactEmail: company.contactEmail,
    contactPhone: company.contactPhone,
  }
  try {
    const response = await axios.put(`/api/companies/${state.application.Company.id}`, newCompany)
    state.application.Company = response.data
    toast.success('Company updated successfully', toastOptions)
    companyEditing.value = false
  } catch (error) {
    console.error('Error updating company: ', error)
    toast.error('Company could not be updated', toastOptions)
  }
}

const currentInput = ref('')

const saveChip = (event) => {
  event.preventDefault()
  ;((props.set && application.skills.indexOf(currentInput.value) === -1) || !props.set) &&
    application.skills.push(currentInput.value)
  currentInput.value = ''
}

const deleteChip = (index) => {
  application.skills.splice(index, 1)
}

const steps = ['Pending', 'Interview', 'Accepted', 'Rejected']

const getStepTitle = (index) => {
  if (index === 3) {
    return state.application.status === 'Accepted' || state.application.status === 'Rejected'
      ? state.application.status //
      : 'Accepted/Rejected'
  }
  return steps[index - 1]
}

const calculateLineWidth = () => {
  const stepWidths = {
    Pending: '0%',
    Interview: '48%',
    Accepted: '96%',
    Rejected: '96%',
  }

  return stepWidths[state.application.status] || '0%'
}

const getBaseUrl = (url) => {
  const regex = /^(https?:\/\/[^/]+\/)/
  const match = url.match(regex)
  return match ? match[1] : null
}

onMounted(async () => {
  try {
    const response = await axios.get(`/api/applications/${applicationId}`)
    state.application = response.data
  } catch (error) {
    console.error('Error fetching application: ', error)
  } finally {
    state.isLoading = false
    createApplication()
    createCompany()
  }
})
</script>

<template>
  <BackButton />
  <section v-if="!state.isLoading">
    <div class="container m-auto py-10 px-6">
      <div class="grid grid-cols-1 md:grid-cols-70-30 w-full gap-6">
        <main>
          <div class="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
            <TransitionGroup name="fade">
              <div v-if="!applicationEditing" key="view" class="relative">
                <div class="flex flex-col items-center">
                  <div class="progress-bar flex mt-2 mb-20">
                    <div
                      class="progress-line"
                      :class="{
                        interview: state.application.status === 'Interview',
                        accepted: state.application.status === 'Accepted',
                        rejected: state.application.status === 'Rejected',
                      }"
                      :style="{ width: calculateLineWidth() }"
                    ></div>
                    <div
                      class="progress-step"
                      v-for="index in 3"
                      :key="index"
                      :data-title="getStepTitle(index)"
                      :class="{
                        pending: state.application.status === 'Pending' && index === 1,
                        interview: state.application.status === 'Interview' && index <= 2,
                        accepted: state.application.status === 'Accepted' && index <= 3,
                        rejected: state.application.status === 'Rejected' && index <= 3,
                      }"
                    ></div>
                  </div>
                </div>

                <div class="text-gray-500 mb-4">{{ state.application.type }}</div>

                <h1 class="text-3xl font-bold mb-4">{{ state.application.title }}</h1>
                <div class="text-gray-500 mb-4 flex align-middle justify-center md:justify-start">
                  <i class="pi pi-map-marker text-lg text-orange-700 mr-2"></i>
                  <p class="text-orange-700">{{ state.application.location }}</p>
                </div>
                <div class="py-6">
                  <h3 class="text-cyan-800 text-lg font-bold mb-6">Job Description</h3>

                  <p class="mb-4">
                    {{ state.application.description }}
                  </p>

                  <h3 class="text-cyan-800 text-lg font-bold mb-2">Salary</h3>

                  <p class="mb-4">
                    {{ state.application.minSalary / 1000 }}K -
                    {{ state.application.maxSalary / 1000 }}K €/Year
                  </p>

                  <h3 class="text-cyan-800 text-lg font-bold mb-2">Link</h3>

                  <div class="mb-4">
                    <a :href="state.application.link" target="_blank">{{
                      getBaseUrl(state.application.link)
                    }}</a>
                  </div>

                  <h3 class="text-cyan-800 text-lg font-bold mb-2">Skills</h3>
                  <div class="w-full flex flex-wrap space-x-2 mb-2">
                    <div
                      class="px-3 py-1 m-1 flex items-center text-sm rounded-full shadow-md bg-slate-800 text-white"
                      v-for="chip of state.application.skills"
                      :key="chip.id"
                    >
                      {{ chip }}
                    </div>
                  </div>
                </div>
              </div>
              <form v-else @submit.prevent="handleSubmit" key="edit">
                <div class="mb-4">
                  <label for="type" class="block text-gray-700 font-bold text-sm mb-2"
                    >Job Type</label
                  >
                  <select
                    v-model="application.type"
                    id="type"
                    name="type"
                    class="shadow-md outline-0 rounded w-full py-2 px-3"
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
                    v-model="application.status"
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
                    v-model="application.title"
                    type="text"
                    id="name"
                    name="name"
                    class="shadow-md outline-0 rounded w-full py-2 px-3 mb-2"
                    placeholder="eg. Frontend Developer"
                    required
                  />
                </div>

                <div class="mb-4">
                  <label for="location" class="block text-gray-700 font-bold text-sm mb-2">
                    Location
                  </label>
                  <input
                    v-model="application.location"
                    type="text"
                    id="location"
                    name="location"
                    class="shadow-md outline-0 rounded w-full py-2 px-3 mb-2"
                    placeholder="Company Location"
                    required
                  />
                </div>

                <div class="mb-4">
                  <label for="description" class="block text-gray-700 font-bold text-sm mb-2"
                    >Description</label
                  >
                  <textarea
                    v-model="application.description"
                    id="description"
                    name="description"
                    class="shadow-md outline-0 rounded w-full py-2 px-3 min-h-40"
                    rows="4"
                    placeholder="Add any job duties, expectations, requirements, etc"
                  ></textarea>
                </div>

                <div class="mb-4">
                  <label for="minSalary" class="block text-gray-700 font-bold text-sm mb-2"
                    >Salary</label
                  >
                  <div class="flex space-x-4">
                    <input
                      v-model="application.minSalary"
                      id="minSalary"
                      name="minSalary"
                      class="shadow-md outline-0 rounded w-full py-2 px-3"
                      type="text"
                      inputmode="numeric"
                      pattern="[0-9]+"
                      oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                      required
                    />
                    <span>_</span>
                    <input
                      v-model="application.maxSalary"
                      id="maxSalary"
                      name="maxSalary"
                      class="shadow-md outline-0 rounded w-full py-2 px-3"
                      type="text"
                      inputmode="numeric"
                      pattern="[0-9]+"
                      oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                      required
                    />
                  </div>
                </div>

                <div class="mb-4">
                  <label for="link" class="block text-gray-700 font-bold text-sm mb-2">Link</label>
                  <input
                    v-model="application.link"
                    type="text"
                    id="link"
                    name="link"
                    class="shadow-md outline-0 rounded w-full py-2 px-3 mb-2"
                    placeholder="https://www.example.com"
                    required
                  />
                </div>
                <div class="mb-4">
                  <label for="skills" class="block text-gray-700 font-bold text-sm mb-2"
                    >Skills</label
                  >
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
                      v-for="(chip, i) of application.skills"
                      :key="chip.label"
                    >
                      {{ chip }}
                      <i class="pi pi-times cursor-pointer ml-2" @click="deleteChip(i)"></i>
                    </div>
                  </div>
                </div>
              </form>
              <div v-if="!applicationEditing" class="relative">
                <button
                  @click="applicationEditing = true"
                  class="button bg-slate-800 hover:bg-slate-900 rounded-full shadow-md w-10 h-10 flex items-center justify-center absolute right-[-0.5rem] top-1.6"
                >
                  <i class="pi pi-pencil text-lg text-white"></i>
                </button>
              </div>
              <div v-else class="relative">
                <button
                  @click.prevent="handleApplicationEdit"
                  class="button bg-slate-800 hover:bg-slate-900 rounded-full shadow-md w-10 h-10 flex items-center justify-center absolute right-[-0.5rem] top-1.6"
                >
                  <i class="pi pi-check text-lg text-white"></i>
                </button>
                <button
                  @click="cancelApplicationEdit"
                  class="button bg-white border border-slate-800 text-slate-800 rounded-full shadow-md w-10 h-10 flex items-center justify-center absolute right-12 top-1.6"
                >
                  <i class="pi pi-times text-lg"></i>
                </button>
              </div>
            </TransitionGroup>
          </div>
        </main>

        <aside>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <TransitionGroup name="fade">
              <div v-if="!companyEditing" class="relative">
                <h3 class="text-xl text-cyan-800 font-bold mb-6">Company Info</h3>

                <h2 class="text-2xl">{{ state.application.Company.name }}</h2>

                <p class="my-2">
                  {{ state.application.Company.description }}
                </p>

                <hr class="my-4" />

                <h3 class="text-lg">Contact Email:</h3>

                <p class="my-2 bg-[aliceblue] p-2 font-bold">
                  {{ state.application.Company.contactEmail }}
                </p>

                <h3 class="text-lg">Contact Phone:</h3>

                <p class="my-2 bg-[aliceblue] p-2 font-bold">
                  {{ state.application.Company.contactPhone }}
                </p>
              </div>
              <div v-else class="relative">
                <div class="mb-4">
                  <label for="company" class="block text-gray-700 font-bold text-sm mb-2"
                    >Company Name</label
                  >
                  <input
                    v-model="company.name"
                    type="text"
                    id="company"
                    name="company"
                    class="shadow-md outline-0 rounded w-full py-2 px-3"
                    placeholder="Company Name"
                  />
                </div>

                <div class="mb-4">
                  <label
                    for="company_description"
                    class="block text-gray-700 font-bold text-sm mb-2"
                    >Company Description</label
                  >
                  <textarea
                    v-model="company.description"
                    id="company_description"
                    name="company_description"
                    class="shadow-md outline-0 rounded w-full py-2 px-3 min-h-55"
                    rows="4"
                    placeholder="What does your company do?"
                  ></textarea>
                </div>

                <div class="mb-4">
                  <label for="contact_email" class="block text-gray-700 font-bold text-sm mb-2"
                    >Contact Email</label
                  >
                  <input
                    v-model="company.contactEmail"
                    type="email"
                    id="contact_email"
                    name="contact_email"
                    class="shadow-md outline-0 rounded w-full py-2 px-3"
                    placeholder="Email address for applicants"
                    required
                  />
                </div>
                <div class="mb-4">
                  <label for="contact_phone" class="block text-gray-700 font-bold text-sm mb-2"
                    >Contact Phone</label
                  >
                  <input
                    v-model="company.contactPhone"
                    type="tel"
                    id="contact_phone"
                    name="contact_phone"
                    class="shadow-md outline-0 rounded w-full py-2 px-3"
                    placeholder="Optional phone for applicants"
                  />
                </div>
              </div>
              <div v-if="!companyEditing" class="relative">
                <button
                  @click="companyEditing = true"
                  class="button bg-slate-800 hover:bg-slate-900 rounded-full shadow-md w-10 h-10 flex items-center justify-center absolute right-[-0.5rem] top-1.6"
                >
                  <i class="pi pi-pencil text-lg text-white"></i>
                </button>
              </div>
              <div v-else class="relative">
                <button
                  @click.prevent="handleCompanyEdit"
                  class="button bg-slate-800 hover:bg-slate-900 rounded-full shadow-md w-10 h-10 flex items-center justify-center absolute right-[-0.5rem] top-1.6"
                >
                  <i class="pi pi-check text-lg text-white"></i>
                </button>
                <button
                  @click="cancelCompanyEdit"
                  class="button bg-white border border-slate-800 text-slate-800 rounded-full shadow-md w-10 h-10 flex items-center justify-center absolute right-12 top-1.6"
                >
                  <i class="pi pi-times text-lg"></i>
                </button>
              </div>
            </TransitionGroup>
          </div>
          <!-- Manage -->
          <div class="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 class="text-xl text-cyan-800 font-bold mb-6">Manage Application</h3>
            <button
              @click="showModal"
              class="slow-fade border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
            >
              Delete Application
            </button>
            <Modal
              ref="modal"
              showCancel
              @confirm="deleteApplication"
              confirmText="Delete"
              dialogText="Delete this application?"
              modal
              class="pt-8"
            />
          </div>
        </aside>
      </div>
    </div>
  </section>
  <div v-else class="text-center text-gray-500 py-6"><PulseLoader /></div>
</template>

<style>
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  position: relative;
}

.slow-fade {
  transition: all 0.6s ease;
}

.progress-bar {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 80%;
}

.progress-bar::before {
  content: '';
  position: absolute;
  top: 50%;
  transform: translateY(-50%) translateX(2%);
  height: 10px;
  width: 96%;
  background-color: lightgray;
}

.progress-step {
  width: 25px;
  height: 25px;
  background-color: lightgray;
  border-radius: 50%;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-step::after {
  content: attr(data-title);
  position: absolute;
  top: calc(100% + 0.3rem);
  color: slategray;
}

.progress-step.pending {
  background-color: rgb(29, 41, 61);
}

.progress-step.interview {
  background-color: rgb(255, 137, 4);
}

.progress-step.accepted {
  background-color: green;
}

.progress-step.rejected {
  background-color: red;
}

.progress-line {
  position: absolute;
  top: 50%;
  left: 2%;
  height: 10px;
  background-color: slategray;
  z-index: 1;
  transform: translateY(-50%);
}

.progress-line.interview {
  background-color: rgb(255, 137, 4);
}

.progress-line.accepted {
  background-color: green;
}

.progress-line.rejected {
  background-color: red;
}
</style>
