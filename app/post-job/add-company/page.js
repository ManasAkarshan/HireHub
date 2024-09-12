"use client"
import ProtectedRoute from '@/components/protected-route'
import React, {useState, useEffect} from 'react'
import { Button } from "@/components/ui/button";
import * as yup from 'yup'
import { addNewCompany, getCompanies } from "@/app/db/apiCompanies";
import useFetch from "@/hooks/useFetch";
import { useRouter } from 'next/navigation';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
import { BeatLoader } from 'react-spinners';
import { UserState } from '@/context/user-context';

const AddCompany = () => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name : "",
    logo : null
  });
  const router = useRouter()
  const {user} = UserState()

  const handleChange = (e)=>{
    const {name, value, files} = e.target;
    setFormData((prevData)=>({
      ...prevData,
      [name]: files ? files[0] : value,
    }))
  }

  const handleSubmit = async ()=>{
    setErrors([])
    try {
      const schema = yup.object({
        name: yup.string().required("Company name is required"),
        logo: yup.mixed().required("Profile picture is required")
      })
      await schema.validate(formData, {abortEarly: false})
      await fnAddCompany(formData)
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

  const {data:addCompanyData, fn:fnAddCompany, loading:loadingAddCompany, error} = useFetch(addNewCompany)
  const {fn: fnCompanies } = useFetch(getCompanies);

  useEffect(()=>{
    if(addCompanyData?.length > 0) {
      router.push('/post-job')
      fnCompanies()
    }
  }, [loadingAddCompany])

  if (user && user?.user_metadata?.role !== "recruiter") router.push("/jobs"); 


  return (
    <ProtectedRoute>
        <div>
        <div className='flex justify-center items-center w-full mt-28 '>
        <Card className='md:w-[40%]'>
            <CardHeader>
                <CardTitle>Add company</CardTitle>
                <CardDescription>Enter company name and logo.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4 ">
                    <Input name='name' type="text" placeholder="Company name" onChange={handleChange}/>
                    {errors.name && <p className="text-red-500">{errors.name}</p>}
                    <input name="logo" type="file" accept="image/*" onChange={handleChange}/>
                    {errors.logo && <p className="text-red-500">{errors.logo}</p>}
                    
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button onClick={handleSubmit} variant="blue" size='lg'>{loadingAddCompany ? <BeatLoader size={10} color="green" /> : "Add"}</Button> 
            </CardFooter>
        </Card>
        </div>
        </div>
    </ProtectedRoute>
  )
}

export default AddCompany