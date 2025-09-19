import { useState, useEffect, useCallback, useRef } from 'react'

export function useApi(url, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortControllerRef = useRef(null)

  const fetchData = useCallback(async () => {
    if (!url) return

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url, {
        ...options,
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [url, options])

  useEffect(() => {
    fetchData()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchData])

  const retry = useCallback(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, retry }
}