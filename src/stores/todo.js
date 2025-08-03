import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import axios from 'config/axios'

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [],
    loading: false,
    filter: 'all',
  }),

  getters: {
    activeTodos: (state) => state.todos.filter((todo) => !todo.completed),
    completedTodos: (state) => state.todos.filter((todo) => todo.completed),
    remaining: (state) => state.todos.filter((todo) => !todo.completed).length,

    filteredTodos: (state) => {
      switch (state.filter) {
        case 'all':
          return state.todos
        case 'active':
          return state.todos.filter((todo) => !todo.completed)
        case 'completed':
          return state.todos.filter((todo) => todo.completed)
        default:
          return state.todos
      }
    },

    todoStats: (state) => ({
      total: state.todos.length,
      active: state.todos.filter((todo) => !todo.completed).length,
      completed: state.todos.filter((todo) => todo.completed).length,
    }),
  },
  actions: {
    setFilter(filter) {
      this.filter = filter
    },

    async fetchTodos() {
      this.loading = true

      try {
        const response = await axios.get('/todo')
        if (response.data?.success) {
          this.todos = (response.data.todos || []).map((todo) => ({
            ...todo,
            id: todo.entity_id,
          }))
          return true
        } else {
          this.showErrorNotification(response.data?.message || 'Failed to fetch todos')
          return false
        }
      } catch (error) {
        this.handleApiError(error, 'Failed to fetch todos')
        return false
      } finally {
        this.loading = false
      }
    },

    async addTodo(title) {
      try {
        const response = await axios.post('/todo', { title: title.trim() })
        if (response.data?.success) {
          this.todos.push({
            ...response.data.todo,
            id: response.data.todo.entity_id,
          })
          return true
        } else {
          this.showErrorNotification(response.data?.message || 'Failed to add todo')
          return false
        }
      } catch (error) {
        this.handleApiError(error, 'Failed to add todo')
        return false
      }
    },

    async toggleTodo(todo) {
      const originCompleted = todo.completed
      todo.completed = !originCompleted

      try {
        const response = await axios.put(`/todo/${todo.entity_id}`, { completed: todo.completed })

        if (!response.data?.success) {
          todo.completed = originCompleted
          this.showErrorNotification(response.data?.message || 'Failed to toggle todo')
          return false
        }
        return true
      } catch (error) {
        todo.completed = originCompleted
        this.handleApiError(error, 'Failed to toggle todo')
        return false
      }
    },

    async editTodo(todo, title) {
      if (!title.trim()) {
        return this.deleteTodo(todo)
      }

      const originTitle = todo.title
      todo.title = title.trim()

      try {
        const response = await axios.put(`/todo/${todo.entity_id}`, { title: todo.title })
        if (!response.data?.success) {
          todo.title = originTitle
          this.showErrorNotification(response.data?.message || 'Failed to edit todo')
          return false
        }
        return true
      } catch (error) {
        todo.title = originTitle
        this.handleApiError(error, 'Failed to edit todo')
        return false
      }
    },

    async deleteTodo(todo) {
      const index = this.todos.indexOf(todo)
      this.todos.splice(index, 1)

      try {
        const response = await axios.delete(`/todo/${todo.entity_id}`)

        if (!response.data?.success) {
          this.todos.splice(index, 0, todo)
          this.showErrorNotification(response.data?.message || 'Failed to delete todo')
          return false
        }
        return true
      } catch (error) {
        this.todos.splice(index, 0, todo)
        this.handleApiError(error, 'Failed to delete todo')
        return false
      }
    },

    async toggleAll(completed) {
      try {
        const response = await axios.put('/todo/toggle-all', { completed })

        if (response.data?.success) {
          this.todos.forEach((todo) => (todo.completed = completed))
          return true
        } else {
          this.showErrorNotification(response.data?.message || 'Failed to toggle all todos')
          return false
        }
      } catch (error) {
        this.handleApiError(error, 'Failed to toggle all todos')
        return false
      }
    },

    async deleteCompleted() {
      const completedTodos = this.todos.filter((todo) => todo.completed)
      this.todos = this.todos.filter((todo) => !todo.completed)

      try {
        const response = await axios.delete('/todo/completed')

        if (!response.data?.success) {
          this.todos.push(...completedTodos)
          this.showErrorNotification(response.data?.message || 'Failed to delete completed todos')
          return false
        }
        return true
      } catch (error) {
        this.todos.push(...completedTodos)
        this.handleApiError(error, 'Failed to delete completed todos')
        return false
      }
    },

    showErrorNotification(message) {
      Notify.create({
        message,
        color: 'negative',
        position: 'top',
        timeout: 5000,
      })
    },

    handleApiError(error, defaultMessage) {
      const message = error.response?.data?.message || defaultMessage
      this.showErrorNotification(message)
      return false
    },
  },
})
