'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notification } from 'antd'
import axios from 'axios'
import type { Filter } from '@/common/filter'

interface ListIncomesParams {
  lastEvaluatedKey?: string
  filter?: Filter
}

const api = {
  listIncomes: ({ lastEvaluatedKey, filter }: ListIncomesParams = {}) => axios.get('/incomes', {
    params: {
      lastEvaluatedKey,
      filter,
    },
  }),
  getIncome: ({ incomeId }) => axios.get(`/incomes/${incomeId}`),
  createIncome: ({ data }) => axios.post('/incomes', { income: data }),
  updateIncome: ({ incomeId, data }) => axios.put(`/incomes/${incomeId}`, { income: data }),
  deleteIncome: ({ incomeId }) => axios.delete(`/incomes/${incomeId}`),
}

interface UseListIncomesQueryParams {
  page?: number
  lastEvaluatedKey?: string
}

interface ListIncomesApiResponse {
  data: IncomeData[]
  lastEvaluatedKey: string
}

export interface IncomeData {
  [k: string]: any
}

export function useListIncomesQuery({ page, lastEvaluatedKey }: UseListIncomesQueryParams) {
  const listIncomesQuery = useQuery<ListIncomesApiResponse>(['incomes', page], async () => {
    const apiResponse = await api.listIncomes({ lastEvaluatedKey })
    return apiResponse.data
  }, {
    keepPreviousData: true,
  })

  return listIncomesQuery
}

interface UseSearchIncomesQueryParams {
  title?: string
  lastEvaluatedKey?: string
}

export function useSearchIncomesQuery({ title, lastEvaluatedKey }: UseSearchIncomesQueryParams) {
  const searchIncomesQuery = useQuery(['searchIncomes', title, lastEvaluatedKey], async () => {
    const filter = title ? {
      filters: [{
        property: 'title',
        value: title,
      }],
    } : undefined
    const apiResponse = await api.listIncomes({ lastEvaluatedKey, filter })
    return apiResponse.data
  },
  {
    keepPreviousData: true,
    staleTime: 30000, // 30s
  })

  return searchIncomesQuery
}

export function useGetIncomeQuery({ incomeId }) {
  const getIncomeQuery = useQuery(['incomes', incomeId], async () => {
    const apiResponse = await api.getIncome({ incomeId })
    return apiResponse.data
  }, {
    enabled: Boolean(incomeId),
  })

  return getIncomeQuery
}

export function useCreateIncomeMutation() {
  const queryClient = useQueryClient()
  const createIncomeMutation = useMutation<any, any, any>(async ({ data }) => {
    try {
      const response = await api.createIncome({ data })

      await queryClient.invalidateQueries(['incomes'])
      return response
    } catch (error: any) {
      notification.error({
        message: 'Create failed',
        description: error?.response?.data?.message || error?.message || 'Unknown error',
        placement: 'topRight',
      })
    }
  })

  return createIncomeMutation
}

export function useUpdateIncomeMutation() {
  const queryClient = useQueryClient()
  const updateIncomeMutation = useMutation<any, any, any>(async ({ incomeId, data }) => {
    try {
      const response = await api.updateIncome({ incomeId, data })

      await Promise.all([
        queryClient.invalidateQueries(['incomes']),
        queryClient.invalidateQueries(['incomes', incomeId]),
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

  return updateIncomeMutation
}

export function useDeleteIncomeMutation() {
  const queryClient = useQueryClient()
  const deleteIncomeMutation = useMutation<any, any, any>(async ({ incomeId }) => {
    try {
      const response = await api.deleteIncome({ incomeId })

      await Promise.all([
        queryClient.invalidateQueries(['incomes']),
        queryClient.invalidateQueries(['incomes', incomeId]),
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

  return deleteIncomeMutation
}
