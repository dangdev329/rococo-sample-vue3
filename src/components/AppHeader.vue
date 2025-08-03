<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
        v-if="authStore.isAuthenticated"
      />

      <q-toolbar-title> Wingspread </q-toolbar-title>

      <div class="q-mr-md text-caption text-grey-5">v{{ version }}</div>

      <div v-if="authStore.isAuthenticated" class="cursor-pointer">
        Logged in as
        <b>{{ authStore.user.first_name }} {{ authStore.user.last_name }}</b>
        <q-icon size="xs" name="arrow_drop_down" />
        <q-menu fir anchor="bottom right" self="top right">
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section @click="goToTodos">Todos</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section @click="goToProfile">Profile</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section @click="authStore.logout()">Logout</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </q-toolbar>
  </q-header>
  <q-drawer v-if="authStore.isAuthenticated" v-model="leftDrawerOpen" show-if-above bordered>
    <q-list>
      <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
    </q-list>
  </q-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from 'stores/auth'
import versionData from '@/version.json'
import EssentialLink from 'components/EssentialLink.vue'
import { useRouter } from 'vue-router'

const linksList = [
  {
    title: 'Dashboard',
    icon: 'code',
    link: '/dashboard',
  },
  {
    title: 'Todos',
    icon: 'list',
    link: '/todos/all',
  },
]

const authStore = useAuthStore()
const router = useRouter()
const version = versionData.version

const leftDrawerOpen = ref(false)

function goToProfile() {
  router.push('/profile')
}

function goToTodos() {
  router.push('/todos/all')
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
