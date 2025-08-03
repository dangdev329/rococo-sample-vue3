<template>
  <q-page class="flex row flex-center">
    <q-card class="col-11 col-sm-8 col-md-6 col-lg-4 col-xl-3 q-pa-xs q-pa-md-sm q-mb-xl">
      <q-card-section>
        <div class="text-h6 text-center">Edit Profile</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onSubmit" class="full-width">
          <!-- First Name -->
          <q-input v-model="first_name" type="text" label="First Name" outlined class="q-mb-lg" />

          <!-- Last Name -->
          <q-input v-model="last_name" type="text" label="Last Name" outlined class="q-mb-md" />
          <!-- Update Button -->
          <q-btn label="Update" color="primary" type="submit" class="full-width" />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const first_name = ref('')
const last_name = ref('')
const loading = ref(false)

const isFormValid = computed(() => {
  return first_name.value?.length > 2 && last_name.value?.length > 2
})

onMounted(async () => {
  if (authStore.user) {
    first_name.value = authStore.user.first_name || ''
    last_name.value = authStore.user.last_name || ''
  }
})

async function onSubmit() {
  if (!isFormValid.value) return

  loading.value = true

  try {
    const result = await authStore.updateProfile({
      first_name: first_name.value,
      last_name: last_name.value,
    })

    if (result.success) {
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Error updating profile:', error)
  } finally {
    loading.value = false
  }
}
</script>
