<script setup>
import { ref, nextTick, computed } from 'vue'

const props = defineProps(['todo', 'index'])
const emit = defineEmits(['delete-todo', 'edit-todo'])

const editing = ref(false)
const editInput = ref(null)
const editText = ref('')

const editModel = computed({
  get() {
    return props.todo.title
  },
  set(value) {
    editText.value = value
  },
})

const toggleModel = computed({
  get() {
    return props.todo.completed
  },
  set(value) {
    emit('toggle-todo', props.todo, value)
  },
})

function startEdit() {
  editing.value = true
  nextTick(() => {
    editInput.value.focus()
  })
}

function finishEdit() {
  editing.value = false
  if (editText.value.trim().length === 0) deleteTodo()
  else updateTodo()
}

function cancelEdit() {
  editing.value = false
}

function deleteTodo() {
  emit('delete-todo', props.todo)
}

function updateTodo() {
  emit('edit-todo', props.todo, editText.value)
  editText.value = ''
}
</script>

<template>
  <q-item
    :class="{
      completed: todo.completed,
      editing: editing,
    }"
  >
    <q-item-section side>
      <q-checkbox v-model="toggleModel" />
    </q-item-section>

    <q-item-section v-if="!editing" @dblclick="startEdit">
      {{ todo.title }}
    </q-item-section>

    <q-item-section v-else>
      <q-input
        ref="editInput"
        v-model="editModel"
        dense
        outlined
        @keyup.enter="finishEdit"
        @blur="cancelEdit"
        aria-label="Edit Todo Input"
      />
    </q-item-section>

    <q-item-section side>
      <q-btn flat round dense icon="delete" @click="deleteTodo" aria-label="Delete Todo" />
    </q-item-section>
  </q-item>
</template>
