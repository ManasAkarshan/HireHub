"use client"
import React, { useEffect } from 'react'
import ProtectedRoute from '@/components/protected-route'
import { UserState } from '@/context/user-context'
import { useParams } from 'next/navigation'
import useFetch from '@/hooks/useFetch'
import { getSingleJob, updateHiringStatus } from '@/app/db/apiJobs'
import { BarLoader } from 'react-spinners'
import Image from 'next/image'
import { Briefcase, DoorClosed, DoorOpen, MapIcon } from 'lucide-react'
import Markdown from 'react-markdown'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ApplyJobDrawer from '../_components/apply-job-drawer'
import ApplicationCard from '../_components/ApplicationCard'


const JobPage = () => {
  const {loading, user} = UserState()
  const {id} = useParams()

  const{data:jobData, fn:fnJob ,loading:loadingJob} = useFetch(getSingleJob, {job_id:id})
  const {data:hiringData, loading:loadingHiringStatus, fn:fnHiringStatus} = useFetch(updateHiringStatus, {job_id : id})

  const handleStatusChange = (value)=>{
    const is_open = value === 'open'
    fnHiringStatus(is_open).then(()=>fnJob())
  }
  useEffect(()=>{
    if(!loading) {
      fnJob() 
    }
      
  },[loading])
  console.log(jobData);
  

  if(loading || loadingJob) return <BarLoader className='mb-4' width={'100%'} color='#36d7b7'/>
  return (
    <ProtectedRoute>
      <div className='flex flex-col gap-8 mt-5'>
        <div className='flex flex-col-reverse gap-6 md:flex-row justify-between items-center'>
          <h1 className='font-extrabold pb-3 text-4xl sm:text-6xl'>{jobData?.title}</h1>
          <Image alt={jobData?.company?.name} src={jobData?.company?.logo_url} width={'100'} height={'100'}/>
        </div>
        <div className='flex justify-between'>
          <div className='flex gap-2'>
            <MapIcon/> {jobData?.location}
          </div>
          <div className='flex gap-2'>
            <Briefcase/>{jobData?.applications?.length} Applicants
          </div>
          <div className='flex gap-2'>
            {jobData?.is_open?<><DoorOpen/>Open</> : <><DoorClosed/>Closed</>}
          </div>
        </div>
        {/* hiring status */}
        {jobData?.recruiter_id === user?.id && (<Select  onValueChange={handleStatusChange}>
          <SelectTrigger className={`w-full ${jobData?.is_open ? "bg-green-950" : "bg-red-950"}`}>
            <SelectValue placeholder={"Hiring Status" + (jobData?.is_open ? "(Open)" : "(Closed)")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='open'>Open</SelectItem>
              <SelectItem value='closed'>Closed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>)}

        <h2 className='text-2xl sm:text-3xl font-bold'>About the job</h2>
        <p className='sm:text-xl'>{jobData?.description}</p>

        <h2 className='text-2xl sm:text-3xl font-bold'>What we are looking for</h2>
        <div className='markdown-container bg-secondary p-4 rounded-sm text-md md:text-lg'>
          <Markdown>{jobData?.requirements}</Markdown>
        </div>
        {/* Application form */}
        { jobData?.recruiter_id !== user?.id && (
          <ApplyJobDrawer job={jobData} user={user} fetchJob={fnJob} applied={jobData?.applications.find((ap)=>ap.candidate_id === user.id)}/>
        )}
        {/* render application */}
        {jobData?.applications?.length > 0 && jobData?.recruiter_id === user?.id &&(
          <div>
            <h2 className='text-2xl sm:text-3xl font-bold mb-3'>Applicants</h2>
            {
              jobData?.applications.map((application)=>{
                return <ApplicationCard key={application.id} application = {application} job={jobData}/>
              })
            }
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}

export default JobPage