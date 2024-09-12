"use client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/protected-route";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectGroup,
} from "@/components/ui/select";
import { State } from "country-state-city";
import useFetch from "@/hooks/useFetch";
import { getCompanies } from "../db/apiCompanies";
import { UserState } from "@/context/user-context";
import { BarLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import * as yup from 'yup'
import { addNewJob } from "../db/apiJobs";
import AddCompanyDrawer from "./_components/add-company-drawer";

const PostJob = () => {
  const { user, loading } = UserState();
  const [errors, setErrors] = useState({})
  const router = useRouter();

  const [formData, setFormData] = useState({
    requirements : "- Add requirements in this format. ",
    title : "",
    company_id : null,
    description : "",
    location : "",
    recruiter_id : null,
    is_open : true
  })

  // handling the  input change
  const handleStatusChange = (name) => (value) => {
    setFormData((prevData)=>({
      ...prevData,
      [name] : value
    }))
  };

  const handleChange = (e)=>{
    const {name, value} = e.target;

    setFormData((prevData)=>({
      ...prevData,
      [name] : value
    }))
  }

  // button to handle form submission
  const handleSubmit = async ()=>{
    setErrors([]);
    try {
      const schema = yup.object({
        requirements : yup.string().required("Requirements are required"),
        title : yup.string().required("Title is required"),
        company_id : yup.string().required("Company is required"),
        description : yup.string().required("Description is required"),
        location : yup.string().required("Location is required"),
      })
      await schema.validate(formData, {abortEarly : false})
      await fnCreateJob(formData)
    } catch (error) {
      const newErrors = {};
      if (error?.inner) {
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({ api: error.message });
      }
    }
  }

  // use fetch here
  const {
    data: companies,
    fn: fnCompanies,
    loading: loadingCompanies,
  } = useFetch(getCompanies);

  const {data: dataCreateJob, loading:loadingCreateJob, error:errorCreateJob, fn:fnCreateJob} = useFetch(addNewJob)

  // use effects 
  useEffect(() => {
    if (!loading){
      fnCompanies();
      formData.recruiter_id = user?.id
    }
  }, [loading]);

  useEffect(()=>{
    if(dataCreateJob?.length > 0) router.push("/jobs")
  }, [loadingCreateJob])

  if (loading || loadingCompanies) return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;

  if (user && user?.user_metadata?.role !== "recruiter") router.push("/jobs"); 


  return (
    <ProtectedRoute>
      <div>
        <h1 className="font-extrabold tex-5xl sm:text-7xl text-center pb-8">
          Post a job
        </h1>

        <div className="flex flex-col gap-4">
          <Input placeholder="Job title" name="title" onChange={handleChange} value={formData.title}/>
          {errors.title && <p className="text-red-500">{errors.title}</p>}
          <Textarea placeholder="Job description" name="description" onChange={handleChange}/>
          {errors.description && <p className="text-red-500">{errors.description}</p>}
          <div className="flex gap-4 items-center" onChange={handleChange}>
            <Select className='flex-1' onValueChange={handleStatusChange('location')}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Add location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {State.getStatesOfCountry("IN").map(({ name }) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.location && <p className="text-red-500">{errors.location}</p>}
            <Select onValueChange={handleStatusChange('company_id')}>
              <SelectTrigger>
                <SelectValue placeholder="Choose company" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {companies?.map(({ name, id }) => {
                    return (
                      <SelectItem key={name} value={id}>
                        {name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.company_id && <p className="text-red-500">{errors.company_id}</p>}
            <Button variant="secondary" onClick={()=>router.push('/post-job/add-company')}>Add company</Button>
          </div>
            
          <MDEditor placeholder="- Add requirements in this format for better presentation" value={formData.requirements} onChange={handleStatusChange('requirements')}/>
          {errors.requirements && <p className="text-red-500">{errors.requirements}</p>}
          {errorCreateJob?.message && (
          <p className="text-red-500">{errorCreateJob?.message}</p>
          )}
          {loadingCreateJob && <BarLoader width={"100%"} color="#36d7b7" />}
          <Button variant="blue" size="lg" onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PostJob;
