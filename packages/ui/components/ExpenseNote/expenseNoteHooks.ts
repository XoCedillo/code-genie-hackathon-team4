'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notification } from 'antd'
import axios from 'axios'
import type { Filter } from '@/common/filter'

interface ListExpenseNotesParams {
  expenseId: string
  lastEvaluatedKey?: string
  filter?: Filter
}

const api = {
  listExpenseNotes: ({ expenseId, lastEvaluatedKey, filter }: ListExpenseNotesParams) => axios.get(`/expenses/${expenseId}/notes`, {
    params: {
      lastEvaluatedKey,
      filter,
    },
  }),
  getExpenseNote: ({ expenseId, noteId }) => axios.get(`/expenses/${expenseId}/notes/${noteId}`),
  createExpenseNote: ({ expenseId, data }) => axios.post(`/expenses/${expenseId}/notes`, { note: data }),
  updateExpenseNote: ({ expenseId, noteId, data }) => axios.put(`/expenses/${expenseId}/notes/${noteId}`, { note: data }),
  deleteExpenseNote: ({ expenseId, noteId }) => axios.delete(`/expenses/${expenseId}/notes/${noteId}`),
}

interface UseListExpenseNotesQueryParams {
  page?: number
  lastEvaluatedKey?: string
  expenseId: string
}

interface ListExpenseNotesApiResponse {
  data: ExpenseNoteData[]
  lastEvaluatedKey: string
}

export interface ExpenseNoteData {
  [k: string]: any
}

export function useListExpenseNotesQuery({ page, lastEvaluatedKey, expenseId }: UseListExpenseNotesQueryParams) {
  const listExpenseNotesQuery = useQuery<ListExpenseNotesApiResponse>(['expenseNotes', expenseId, page], async () => {
    const apiResponse = await api.listExpenseNotes({ lastEvaluatedKey, expenseId })
    return apiResponse.data
  }, {
    keepPreviousData: true,
  })

  return listExpenseNotesQuery
}

export function useGetExpenseNoteQuery({ expenseId, noteId }) {
  const getExpenseNoteQuery = useQuery(['expenseNotes', expenseId, noteId], async () => {
    const apiResponse = await api.getExpenseNote({ expenseId, noteId })
    return apiResponse.data
  }, {
    enabled: Boolean(expenseId && noteId),
  })

  return getExpenseNoteQuery
}

export function useCreateExpenseNoteMutation() {
  const queryClient = useQueryClient()
  const createExpenseNoteMutation = useMutation<any, any, any>(async ({ expenseId, data }) => {
    try {
      const response = await api.createExpenseNote({ expenseId, data })

      await queryClient.invalidateQueries(['expenseNotes', expenseId])
      return response
    } catch (error: any) {
      notification.error({
        message: 'Create failed',
        description: error?.response?.data?.message || error?.message || 'Unknown error',
        placement: 'topRight',
      })
    }
  })

  return createExpenseNoteMutation
}

export function useUpdateExpenseNoteMutation() {
  const queryClient = useQueryClient()
  const updateExpenseNoteMutation = useMutation<any, any, any>(async ({ expenseId, noteId, data }) => {
    try {
      const response = await api.updateExpenseNote({ expenseId, noteId, data })

      await Promise.all([
        queryClient.invalidateQueries(['expenseNotes', expenseId]),
        queryClient.invalidateQueries(['expenseNotes', expenseId, noteId]),
      ])

      return response
    } catch (error: any) {
      notification.error({
        message: 'Update failed',
        description: error?.response?.data?.message || error?.message || 'Unknown error',
        placement: 'topRight',
      })
    }
  })

  return updateExpenseNoteMutation
}

export function useDeleteExpenseNoteMutation() {
  const queryClient = useQueryClient()
  const deleteExpenseNoteMutation = useMutation<any, any, any>(async ({ expenseId, noteId }) => {
    try {
      const response = await api.deleteExpenseNote({ expenseId, noteId })

      await Promise.all([
        queryClient.invalidateQueries(['expenseNotes', expenseId]),
        queryClient.invalidateQueries(['expenseNotes', expenseId, noteId]),
      ])

      return response
    } catch (error: any) {
      notification.error({
        message: 'Delete failed',
        description: error?.response?.data?.message || error?.message || 'Unknown error',
        placement: 'topRight',
      })
    }
  })

  return deleteExpenseNoteMutation
}
