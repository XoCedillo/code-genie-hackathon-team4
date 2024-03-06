'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notification } from 'antd'
import axios from 'axios'
import type { Filter } from '@/common/filter'

interface ListExpensesParams {
  lastEvaluatedKey?: string
  filter?: Filter
}

const api = {
  listExpenses: ({ lastEvaluatedKey, filter }: ListExpensesParams = {}) => axios.get('/expenses', {
    params: {
      lastEvaluatedKey,
      filter,
    },
  }),
  getExpense: ({ expenseId }) => axios.get(`/expenses/${expenseId}`),
  createExpense: ({ data }) => axios.post('/expenses', { expense: data }),
  updateExpense: ({ expenseId, data }) => axios.put(`/expenses/${expenseId}`, { expense: data }),
  deleteExpense: ({ expenseId }) => axios.delete(`/expenses/${expenseId}`),
}

interface UseListExpensesQueryParams {
  page?: number
  lastEvaluatedKey?: string
}

interface ListExpensesApiResponse {
  data: ExpenseData[]
  lastEvaluatedKey: string
}

export interface ExpenseData {
  [k: string]: any
}

export function useListExpensesQuery({ page, lastEvaluatedKey }: UseListExpensesQueryParams) {
  const listExpensesQuery = useQuery<ListExpensesApiResponse>(['expenses', page], async () => {
    const apiResponse = await api.listExpenses({ lastEvaluatedKey })
    return apiResponse.data
  }, {
    keepPreviousData: true,
  })

  return listExpensesQuery
}

interface UseSearchExpensesQueryParams {
  title?: string
  lastEvaluatedKey?: string
}

export function useSearchExpensesQuery({ title, lastEvaluatedKey }: UseSearchExpensesQueryParams) {
  const searchExpensesQuery = useQuery(['searchExpenses', title, lastEvaluatedKey], async () => {
    const filter = title ? {
      filters: [{
        property: 'title',
        value: title,
      }],
    } : undefined
    const apiResponse = await api.listExpenses({ lastEvaluatedKey, filter })
    return apiResponse.data
  },
  {
    keepPreviousData: true,
    staleTime: 30000, // 30s
  })

  return searchExpensesQuery
}

export function useGetExpenseQuery({ expenseId }) {
  const getExpenseQuery = useQuery(['expenses', expenseId], async () => {
    const apiResponse = await api.getExpense({ expenseId })
    return apiResponse.data
  }, {
    enabled: Boolean(expenseId),
  })

  return getExpenseQuery
}

export function useCreateExpenseMutation() {
  const queryClient = useQueryClient()
  const createExpenseMutation = useMutation<any, any, any>(async ({ data }) => {
    try {
      const response = await api.createExpense({ data })

      await queryClient.invalidateQueries(['expenses'])
      return response
    } catch (error: any) {
      notification.error({
        message: 'Create failed',
        description: error?.response?.data?.message || error?.message || 'Unknown error',
        placement: 'topRight',
      })
    }
  })

  return createExpenseMutation
}

export function useUpdateExpenseMutation() {
  const queryClient = useQueryClient()
  const updateExpenseMutation = useMutation<any, any, any>(async ({ expenseId, data }) => {
    try {
      const response = await api.updateExpense({ expenseId, data })

      await Promise.all([
        queryClient.invalidateQueries(['expenses']),
        queryClient.invalidateQueries(['expenses', expenseId]),
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

  return updateExpenseMutation
}

export function useDeleteExpenseMutation() {
  const queryClient = useQueryClient()
  const deleteExpenseMutation = useMutation<any, any, any>(async ({ expenseId }) => {
    try {
      const response = await api.deleteExpense({ expenseId })

      await Promise.all([
        queryClient.invalidateQueries(['expenses']),
        queryClient.invalidateQueries(['expenses', expenseId]),
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

  return deleteExpenseMutation
}
