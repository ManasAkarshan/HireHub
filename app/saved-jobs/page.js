"use client"
import ProtectedRoute from '@/components/protected-route'
import useFetch from '@/hooks/useFetch'
import React, { useEffect } from 'react'
import { getSavedJobs } from '../db/apiJobs'
import { UserState } from '@/context/user-context'
import { BarLoader } from 'react-spinners'
import JobCard from '../(job-listing)/jobs/components/job-card'

const SavedJobs = () => {
  const {loading} = UserState()
  const {data:savedJobs, loading:loadingSavedJobs, fn:fnGetSaved} = useFetch(getSavedJobs)
  console.log(savedJobs);
  useEffect(() => {
    if(!loading) fnGetSaved()
  }, [loading])
  

  if(loading) return <BarLoader className='mb-4' width={'100%'} color='#36d7b7'/>
  return (
    <ProtectedRoute>
      <div>
      {!loadingSavedJobs && (
          <div className="mt-8 grid md:grid-col-2 lg:grid-cols-3 gap-6">
            {savedJobs?.length>0 ? savedJobs.map((saved) => {return <JobCard key={saved.id} job={saved.job} savedInit={true} onJobSaved={fnGetSaved}/>}) : <div>No jobs found</div>}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}

export default SavedJobs