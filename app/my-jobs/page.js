"use client"
import ProtectedRoute from '@/components/protected-route'
import { UserState } from '@/context/user-context'
import React from 'react'
import { BarLoader } from 'react-spinners'
import CreatedApplications from './_components/created-applications'
import CreatedJobs from './_components/created-jobs'

const MyJobs = () => {
  const {loading, user} = UserState()
  

  if(loading) return <BarLoader className='mb-4' width={'100%'} color='#36d7b7'/>

  return (
    <ProtectedRoute>
      <div>
        <h1 className='font-extrabold text-5xl sm:text-7xl text-center pb-8'>
          {user?.user_metadata?.role === "candidate" ? "My Applications" : "My Jobs"}
        </h1>
        {user?.user_metadata?.role === "candidate" ? (<CreatedApplications/>):(<CreatedJobs/>)}
      </div>
    </ProtectedRoute>
  )
}

export default MyJobs