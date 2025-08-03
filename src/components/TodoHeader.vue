<script setup>
import { RouterLink } from 'vue-router'

const emit = defineEmits(['add-todo'])

function addTodo(event) {
  emit('add-todo', event.target.value)
  event.target.value = ''
}
</script>

<template>
  <div class="q-pa-md">
    <div class="q-pa-md">
      <RouterLink to="/" class="text-black text-decoration-none">
        <h1 class="text-h4 q-my-none">todos</h1>
      </RouterLink>
    </div>
    <q-input
      outlined
      dense
      autofocus
      class="q-pa-md"
      placeholder="What needs to be done?"
      @keyup.enter="addTodo"
    />
  </div>
</template>
