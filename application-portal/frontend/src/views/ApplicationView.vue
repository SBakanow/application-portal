<script setup>
import { ref, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import BackButton from '@/components/BackButton.vue'
import { useToast } from 'vue-toastification'
import Modal from '@/components/Modal.vue'
import CompanyForm from '@/components/CompanyForm.vue'
import ApplicationForm from '@/components/ApplicationForm.vue'
import {
  getApplicationQuery,
  getCountByStatusQuery,
  getCountByTypeQuery,
} from '@/graphql/queries.js'
import { deleteApplicationMutation, updateApplicationMutation } from '@/graphql/mutations.js'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { useAuthStore } from '@/store/authStore'

const authStore = useAuthStore()
const user = authStore.user.username

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

const { result, loading } = useQuery(getApplicationQuery, { applicationId })

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
  const filteredApplicationData = pick(result.value?.application, [
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
  const filteredCompanyData = pick(result.value?.application.company, [
    'name',
    'description',
    'contactEmail',
    'contactPhone',
  ])
  Object.assign(company, filteredCompanyData)
}

const {
  mutate: updateApplication,
  onDone: onApplicationUpdateDone,
  onError: onApplicationUpdateError,
} = useMutation(updateApplicationMutation, () => ({
  variables: {
    id: applicationId,
    input: {
      type: application.type,
      status: application.status,
      title: application.title,
      description: application.description,
      minSalary: application.minSalary,
      maxSalary: application.maxSalary,
      location: application.location,
      link: application.link,
      skills: application.skills,
      company: {
        name: company.name,
        description: company.description,
        contactEmail: company.contactEmail,
        contactPhone: company.contactPhone,
      },
    },
  },
  refetchQueries: [
    { query: getCountByTypeQuery, variables: user },
    { query: getCountByStatusQuery, variables: user },
  ],
}))

let updateType = ''

onApplicationUpdateDone((_) => {
  toast.success(`${updateType} updated successfully`, toastOptions)
})

onApplicationUpdateError((error) => {
  console.error('Error updating application: ', error)
  toast.error('Application could not be updated', toastOptions)
})

const handleUpdate = (type) => {
  updateType = type

  if (type === 'Application') {
    applicationEditing.value = false
  } else if (type === 'Company') {
    companyEditing.value = false
  }

  updateApplication()
}

const {
  mutate: deleteApplication,
  onDone: onApplicationDeleteDone,
  onError: onApplicationDeleteError,
} = useMutation(deleteApplicationMutation, () => ({
  variables: {
    id: applicationId,
  },
}))

onApplicationDeleteDone((_) => {
  toast.success('Application deleted successfully', toastOptions)
  router.push('/applications')
})

onApplicationDeleteError((error) => {
  console.error('Error deleting application: ', error)
  toast.error('Application could not be deleted', toastOptions)
})

const steps = ['Pending', 'Interview', 'Accepted', 'Rejected']

const getStepTitle = (index) => {
  if (index === 3) {
    return result.value?.application.status === 'Accepted' ||
      result.value?.application.status === 'Rejected'
      ? result.value?.application.status //
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

  return stepWidths[result.value?.application.status] || '0%'
}

const getBaseUrl = (url) => {
  const regex = /^(https?:\/\/[^/]+\/)/
  const match = url.match(regex)
  return match ? match[1] : url
}

watch(
  () => result.value,
  (newValue) => {
    if (newValue && newValue.application) {
      createApplication()
      createCompany()
    }
  },
  { immediate: true },
)
</script>

<template>
  <BackButton />
  <section v-if="!loading">
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
                        interview: result.application.status === 'Interview',
                        accepted: result.application.status === 'Accepted',
                        rejected: result.application.status === 'Rejected',
                      }"
                      :style="{ width: calculateLineWidth() }"
                    ></div>
                    <div
                      class="progress-step"
                      v-for="index in 3"
                      :key="index"
                      :data-title="getStepTitle(index)"
                      :class="{
                        pending: result.application.status === 'Pending' && index === 1,
                        interview: result.application.status === 'Interview' && index <= 2,
                        accepted: result.application.status === 'Accepted' && index <= 3,
                        rejected: result.application.status === 'Rejected' && index <= 3,
                      }"
                    ></div>
                  </div>
                </div>

                <div class="text-gray-500 mb-4">{{ result.application.type }}</div>

                <h1 class="text-3xl font-bold mb-4">{{ result.application.title }}</h1>
                <div class="text-gray-500 mb-4 flex align-middle justify-center md:justify-start">
                  <i class="pi pi-map-marker text-lg text-orange-700 mr-2"></i>
                  <p class="text-orange-700">{{ result.application.location }}</p>
                </div>
                <div class="py-6">
                  <h3 class="text-cyan-800 text-lg font-bold mb-6">Job Description</h3>

                  <p class="mb-4">
                    {{ result.application.description }}
                  </p>

                  <h3 class="text-cyan-800 text-lg font-bold mb-2">Salary</h3>

                  <p class="mb-4">
                    {{ result.application.minSalary / 1000 }}K -
                    {{ result.application.maxSalary / 1000 }}K €/Year
                  </p>

                  <h3 class="text-cyan-800 text-lg font-bold mb-2">Link</h3>

                  <div class="mb-4">
                    <a :href="result.application.link" target="_blank">{{
                      getBaseUrl(result.application.link)
                    }}</a>
                  </div>

                  <h3 class="text-cyan-800 text-lg font-bold mb-2">Skills</h3>
                  <div class="w-full flex flex-wrap space-x-2 mb-2">
                    <div
                      class="px-3 py-1 my-1 flex items-center text-sm rounded-full shadow-md bg-slate-800 text-white"
                      v-for="chip of result.application.skills"
                      :key="chip.id"
                    >
                      {{ chip }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="relative">
                <ApplicationForm :application="application" />
              </div>
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
                  @click.prevent="handleUpdate('Application')"
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

                <h2 class="text-2xl">{{ result.application.company.name }}</h2>

                <p class="my-2">
                  {{ result.application.company.description }}
                </p>

                <hr class="my-4" />

                <h3 class="text-lg">Contact Email:</h3>

                <p class="my-2 py-2 font-bold">
                  {{ result.application.company.contactEmail }}
                </p>

                <h3 class="text-lg">Contact Phone:</h3>

                <p class="my-2 py-2 font-bold">
                  {{ result.application.company.contactPhone }}
                </p>
              </div>
              <div v-else class="relative">
                <CompanyForm :company="company" />
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
                  @click.prevent="handleUpdate('Company')"
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
  transition: opacity 0.5s ease;
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
