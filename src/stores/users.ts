import { defineStore } from 'pinia'
import type { User } from '@/types'
import { usersApi, type CreateUserPayload } from '@/services/api/usersApi'
import { useNotificationStore } from './notifications'

interface UsersState {
  users: User[]
  loading: boolean
  creating: boolean
}

export const useUsersStore = defineStore('users', {
  state: (): UsersState => ({
    users: [],
    loading: false,
    creating: false,
  }),
  actions: {
    async fetch() {
      this.loading = true
      try {
        this.users = await usersApi.list()
      } finally {
        this.loading = false
      }
    },
    async create(payload: CreateUserPayload) {
      this.creating = true
      try {
        const user = await usersApi.create(payload)
        this.users = [user, ...this.users]
        useNotificationStore().push({
          id: crypto.randomUUID(),
          type: 'success',
          title: 'Success',
          message: 'notifications.updateSuccess',
        })
        return user
      } finally {
        this.creating = false
      }
    },
  },
})
