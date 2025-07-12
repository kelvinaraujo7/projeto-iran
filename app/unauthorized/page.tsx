"use client"
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Acesso Negado</h1>
        <p className="text-gray-600 mb-4">
          Você não tem permissão para acessar esta página.
        </p>
        <div className="space-x-2">
          <Button onClick={() => router.back()}>
            Voltar
          </Button>
          <Button variant="outline" onClick={() => router.push('/departments')}>
            Ir para Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}