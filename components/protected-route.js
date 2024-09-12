"use client"
import { UserState } from '@/context/user-context'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BarLoader } from 'react-spinners'

const ProtectedRoute = ({children}) => {
  const router = useRouter()
  const {isAuthenticated, loading, user} = UserState()
  

  useEffect(() => {
    if(!isAuthenticated && loading===false) router.push('/auth')
  }, [isAuthenticated, loading])
  
  if(user && user?.user_metadata?.role === undefined) router.push('/onboarding') 
  if(loading) return <BarLoader width={'100%'} color='#36d7b7'/>
  if (isAuthenticated) return children;
}

export default ProtectedRoute