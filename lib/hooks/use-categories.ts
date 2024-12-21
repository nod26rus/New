import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Category {
  id: string
  name: string
  slug: string
  count?: number
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCategories() {
      try {
        const { data } = await supabase
          .from('tags')
          .select('id, name, slug')
          .limit(7)
          .order('name')

        setCategories(data || [])
      } catch (error) {
        console.error('Error loading categories:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  return { categories, loading }
}