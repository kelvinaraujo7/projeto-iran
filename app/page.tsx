"use client"
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const hasRedirected = useRef(false)

  useEffect(() => {
    // ✅ AVOID MULTIPLE REDIRECTIONS
    if (!isLoading && !hasRedirected.current) {
      hasRedirected.current = true
      
      if (isAuthenticated) {
        router.replace('/dashboard') // replace instead of push
      } else {
        router.replace('/auth')
      }
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return null
}