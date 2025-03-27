<script setup>
import { ref } from 'vue'

const dialog = ref()
const position = ref({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' })

const props = defineProps({
  confirmText: {
    type: String,
    default: 'Confirm',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
  hideConfirm: {
    type: Boolean,
    default: false,
  },
  showCancel: {
    type: Boolean,
    default: false,
  },
  dialogText: {
    type: String,
    default: '',
  },
  modal: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['confirm'])

const cancel = () => {
  dialog.value.close()
  visible.value = false
}

const confirm = () => {
  dialog.value.close()
  emit('confirm')
}

const visible = ref(false)

const showModal = (triggerElement = null) => {
  if (!props.modal && triggerElement) {
    const rect = triggerElement.getBoundingClientRect()
    position.value = {
      top: '55px',
      left: '430px',
      transform: 'none',
    }
    dialog.value.show()
  } else {
    position.value = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    dialog.value.showModal()
  }
  visible.value = true
}

defineExpose({
  show: showModal,
  close: (returnValue) => dialog.value.close(returnValue),
  cancel,
  visible,
})
</script>

<template>
  <dialog
    id="myDialog"
    ref="dialog"
    :style="{ top: position.top, left: position.left, transform: position.transform }"
    :class="{
      'rounded-xl shadow-md  min-w-80 flex px-4 py-4 text-center z-50': visible,
    }"
    @close="visible = false"
  >
    <form v-if="visible" method="dialog" class="w-full">
      <p class="font-bold text-xl">{{ props.dialogText }}</p>
      <slot />
      <div class="flex justify-center space-x-4 py-6" v-if="!props.hideConfirm || props.showCancel">
        <button
          v-if="props.showCancel"
          value="false"
          class="button bg-slate-800 hover:bg-slate-900 text-white text-center font-bold py-2 px-4 rounded-full w-30 focus:outline-none focus:shadow-outline mt-4 block"
          @click.prevent="cancel"
        >
          {{ props.cancelText }}
        </button>
        <button
          v-if="!props.hideConfirm"
          value="true"
          class="button border border-red-500 text-red-500 font-bold py-2 px-4 rounded-full w-30 focus:outline-none focus:shadow-outline mt-4 block"
          @click.prevent="confirm"
        >
          {{ props.confirmText }}
        </button>
      </div>
    </form>
  </dialog>
</template>

<style scoped>
dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
