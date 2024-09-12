import supabase, {supabaseUrl} from "@/utils/supabase/client";

export async function getCompanies() {
    const {data, error} = await supabase.from('companies').select('*')
    if(error) {
        console.log("Error fetching companies");
        return null
    }

    return data;
}

export async function addNewCompany(_, company_data) {
    const random = Math.floor(Math.random() * 9000)
    const fileName = `logo-${random}-${company_data.name}`

    const {error:storageError} = await supabase.storage.from('company-logo').upload(fileName, company_data.logo)

    if(storageError) {
        console.log("Error uploading company logo:", error);
        return null
    }
    const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`

    const {data, error} = await supabase.from("companies").insert([{
        name : company_data.name,
        logo_url
    }]).select('*')

    if(error) {
        console.log("Error submitting company");
        return null
    }

    return data;
}
