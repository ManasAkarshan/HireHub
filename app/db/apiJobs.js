import supabase from "@/utils/supabase/client";

export async function getJobs({location, company_id, searchQuery }){
    console.log(location);
    let query = supabase.from('jobs').select('*, saved:saved_jobs(id), company:companies(name, logo_url)')// look for foreign key connection with companies table

    if(location){
        query = query.ilike("location", location);
    }
    if(company_id){
        query =query.eq("company_id", company_id)
    }
    if(searchQuery){
        query =query.ilike("title", `%${searchQuery}%`)
    }

    const {data, error} = await query;

    if(error){
        console.error("Error fetching jobs:", error);
        return null
    }

    return data;
}

export async function saveJob({alreadySaved}, saveData){      // saveData = {user_id, job_id}
    if(alreadySaved){
        const {data, error:deleteError} = await supabase.from('saved_jobs').delete().eq("job_id", saveData.job_id)
        if(deleteError) {
            console.log("Error deleting saved job:", deleteError);
            return data;
        }
        return data;
    }
    else{
        const {data, error:insertionError } = await supabase.from('saved_jobs').insert([saveData]).select('*')
        if(insertionError) {
            console.log("Error saving the job:", insertionError);
            return data;
        }

        return data;
    }
}

export async function getSingleJob({job_id}) {
    const {data, error} = await supabase.from('jobs').select('*, company:companies(name, logo_url), applications: applications(*)').eq("id", job_id).single()

    if(error) {
        console.log("Error fetching single job", error);
        return null
    }

    return data
}

export async function updateHiringStatus({job_id}, is_open) {
    const {data, error} = await supabase.from('jobs').update({is_open}).eq("id", job_id).single()

    if(error) {
        console.log("Error updating hiring status", error);
        return null
    }

    return data;
}

export async function addNewJob(_, jobData) {
    const {error, data} = await supabase.from('jobs').insert([jobData]).select('*')

    if(error) {
        console.log("Error adding job", error);
        return null
    }

    return data;
}
export async function getSavedJobs() {
    const {error, data} = await supabase.from('saved_jobs').select('*, job:jobs(*, company:companies(name, logo_url))')

    if(error) {
        console.log("Error fetching saved job", error);
        return null
    }

    return data;
}
export async function getMyJobs({recruiter_id}) {
    const {error, data} = await supabase.from('jobs').select('*,  company:companies(name, logo_url)').eq("recruiter_id", recruiter_id)

    if(error) {
        console.log("Error fetching my job", error);
        return null
    }

    return data;
}
export async function deleteJob({job_id}) {
    const {error, data} = await supabase.from('jobs').delete().eq("id", job_id).select('*')

    if(error) {
        console.log("Error deleting job job", error);
        return null
    }

    return data;
}