<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useTodoStore } from 'stores/todo'

import TodoFooter from 'components/TodoFooter.vue'
import TodoHeader from 'components/TodoHeader.vue'
import TodoItem from 'components/TodoItem.vue'

const todoStore = useTodoStore()
const route = useRoute()

watch(
  () => route.path,
  (newPath) => {
    const filter = newPath.split('/').pop() || 'all'
    todoStore.setFilter(filter)
  },
  { immediate: true },
)

const filteredTodos = computed(() => todoStore.filteredTodos)

const toggleAllModel = computed({
  get() {
    return todoStore.activeTodos.length === 0 && todoStore.todos.length > 0
  },
  set(value) {
    todoStore.toggleAll(value)
  },
})

onMounted(() => {
  todoStore.fetchTodos()
})

function addTodo(value) {
  todoStore.addTodo(value)
}

function deleteTodo(todo) {
  todoStore.deleteTodo(todo)
}

function toggleTodo(todo) {
  todoStore.toggleTodo(todo)
}

function editTodo(todo, value) {
  todoStore.editTodo(todo, value)
}

function deleteCompleted() {
  todoStore.deleteCompleted()
}
</script>

<template>
  <q-page class="q-pa-md">
    <TodoHeader @add-todo="addTodo" />
    <q-card v-show="todoStore.todos.length > 0" flat bordered>
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-checkbox
            v-model="toggleAllModel"
            :disable="filteredTodos.length === 0"
            label="Toggle All"
          />
        </div>
        <q-list separator>
          <TodoItem
            v-for="(todo, index) in filteredTodos"
            :key="todo.id"
            :todo="todo"
            :index="index"
            @delete-todo="deleteTodo"
            @edit-todo="editTodo"
            @toggle-todo="toggleTodo"
          />
        </q-list>
      </q-card-section>
    </q-card>
    <TodoFooter :todos="todoStore.todos" @delete-completed="deleteCompleted" />
  </q-page>
</template>
