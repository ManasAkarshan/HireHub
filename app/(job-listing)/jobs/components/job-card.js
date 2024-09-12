import React, { useEffect, useState } from 'react'
import { Heart, MapPinIcon, Trash2Icon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import useFetch from '@/hooks/useFetch';
import { deleteJob, saveJob } from '@/app/db/apiJobs';
import { UserState } from '@/context/user-context';
import { BarLoader } from 'react-spinners';

const JobCard = ({job, isMyJob = false, savedInit = false, onJobSaved = ()=>{}}) => {
    const {user} = UserState()
    const [saved, setSaved] = useState(savedInit)
    const {fn:fnSaveJob, data:savedJob ,loading:loadingSaveJob} = useFetch(saveJob, {alreadySaved:saved})
    // if the component just rendered / re-rendered and fnSaveJob is never run then saveJob and loadingSaveJob both will be null
    // console.log(savedInit)
    const {loading:loadingDelete, fn:fnDelete} = useFetch(deleteJob, {job_id : job.id})
    // for deleting job
    const handleDeleteJob = async ()=>{
        await fnDelete()
        onJobSaved()
    }

    const handleSaveJob = async()=>{
        await fnSaveJob({
            user_id : user.id,
            job_id : job.id
        });
        onJobSaved()
    }

    useEffect(()=>{
        if(savedJob !== undefined && savedJob !== null){  
            setSaved(savedJob?.length > 0)
        }
        else if(savedJob === null || savedJob === undefined){
            if(loadingSaveJob === false) setSaved(false)
        }
    }, [savedJob, loadingSaveJob])
  return (
    <div>
        <Card className='flex flex-col h-full'>
            {loadingDelete && <BarLoader width={'100%'} className='mt-3' color='#36d7b7'/>}
            <CardHeader>
                <CardTitle className='flex justify-between font-bold'>
                    {job.title}
                    {isMyJob && <Trash2Icon fill='red' size={18} className='text-red-300 cursor-pointer' onClick={handleDeleteJob}/>}
                </CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-4 flex-1'>
                <div className='flex justify-between'>
                    {job.company && <img src={job.company.logo_url} className='h-6'/>}
                    <div className='flex gap-2 items-center'>
                        <MapPinIcon size={15}/> {job.location}
                    </div>
                </div>
                <hr/>
                {job.description.includes('.') ? job.description.substring(0, job.description.indexOf(".")) + '.' : job.description.substring(0,100) + '...'}
                
            </CardContent> 
            <CardFooter className='flex gap-2'>
                <Link href={`/job/${job.id}`} >
                    <Button  >More Details</Button>
                </Link>
                {!isMyJob && (
                    <Button variant='ghost' className='w-15' onClick={handleSaveJob} disabled={loadingSaveJob}>
                        {saved ? <Heart size={20} stroke='red' fill='red'/> : <Heart size={20} stroke='red'/> }
                    </Button>
                )}
                
            </CardFooter>
        </Card>
        
    </div>
  )
}

export default JobCard