<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps(['todos'])
const route = useRoute()
const remaining = computed(() => props.todos.filter((todo) => !todo.completed).length)
</script>

<template>
  <q-footer class="bg-white text-black" v-show="todos.length > 0">
    <q-toolbar class="justify-between">
      <q-toolbar-title class="text-body2">
        <strong>{{ remaining }}</strong> {{ remaining === 1 ? 'item' : 'items' }} left
      </q-toolbar-title>

      <q-tabs dense class="text-primary">
        <q-route-tab to="/todos/all" :label="'All'" :active="route.name === 'all'" />
        <q-route-tab to="/todos/active" :label="'Active'" :active="route.name === 'active'" />
        <q-route-tab
          to="/todos/completed"
          :label="'Completed'"
          :active="route.name === 'completed'"
        />
      </q-tabs>

      <q-btn
        flat
        label="Clear Completed"
        v-show="todos.some((todo) => todo.completed)"
        @click="$emit('delete-completed')"
      />
    </q-toolbar>
  </q-footer>
</template>
