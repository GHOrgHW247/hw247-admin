import { useState, useCallback } from 'react'
import { Order, PaginatedResponse } from '@/lib/types'
import { OrderService } from '@/lib/services/orderService'

interface Filters {
  search?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  minAmount?: number
  maxAmount?: number
}

interface UseOrderFiltersResult {
  orders: Order[]
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  totalItems: number
  filters: Filters
  setFilters: (filters: Filters) => Promise<void>
  setPage: (page: number) => Promise<void>
  refetch: () => Promise<void>
}

export function useOrderFilters(): UseOrderFiltersResult {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [filters, setCurrentFilters] = useState<Filters>({})

  const fetchOrders = useCallback(
    async (page: number = 1, newFilters: Filters = filters) => {
      try {
        setLoading(true)
        setError(null)

        const response: PaginatedResponse<Order> = await OrderService.getOrders({
          page,
          limit: 10,
          ...newFilters,
        })

        setOrders(response.data)
        setCurrentPage(response.page)
        setTotalPages(response.total_pages)
        setTotalItems(response.total)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch orders')
        console.error(err)
      } finally {
        setLoading(false)
      }
    },
    [filters]
  )

  const setFilters = useCallback(async (newFilters: Filters) => {
    setCurrentFilters(newFilters)
    setCurrentPage(1)
    await fetchOrders(1, newFilters)
  }, [fetchOrders])

  const setPage = useCallback(
    async (page: number) => {
      await fetchOrders(page, filters)
    },
    [fetchOrders, filters]
  )

  const refetch = useCallback(async () => {
    await fetchOrders(currentPage, filters)
  }, [fetchOrders, currentPage, filters])

  return {
    orders,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    filters,
    setFilters,
    setPage,
    refetch,
  }
}
