import supabase, {supabaseUrl} from "@/utils/supabase/client";

export async function applyToJobs({experience, skills, education, resume, candidate_id, job_id, status, name}) {
    const random = Math.floor(Math.random() * 9000)
    const fileName = `resume-${random}-${candidate_id}`

    const {error:storageError} = await supabase.storage.from('resumes').upload(fileName, resume)

    if(storageError) {
        console.log("Error uploading resume:", error);
    }


    const {data, error} = await supabase.from('applications').insert([
        {   
            name,
            experience, 
            skills, 
            education, 
            resume : `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`,
            candidate_id,
            job_id,
            status
        }
    ]).select('*')

    if(error){
        console.log("Error applying:", error);
        return null
    }

    return data
}

export async function updateApplicationsStatus({job_id}, status) {
    const {data, error} = await supabase.from('applications').update({status}).eq('job_id', job_id).select('*')

    if(error || data.length === 0){
        console.log("Error updating application status:", error);
        return null
    }

    return data
}

export async function getApplications({user_id}) {
    const {data , error} = await supabase.from("applications").select('*, job:jobs(title, company:companies(name))').eq('candidate_id', user_id)

    if(error || data.length === 0){
        console.log("Error getting application:", error);
        return null
    }

    return data
}