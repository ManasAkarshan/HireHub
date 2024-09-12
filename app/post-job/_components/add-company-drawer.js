import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as yup from 'yup'
import { addNewCompany } from "@/app/db/apiCompanies";
import useFetch from "@/hooks/useFetch";

const AddCompanyDrawer = ({ fetchCompanies }) => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name : "",
    logo : null
  });

  const {data:addCompanyData, fn:fnAddCompany, loading:loadingAddCompany, error} = useFetch(addNewCompany)

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

  useEffect(()=>{
    if(addCompanyData?.length > 0) {
      fetchCompanies()
    }
  }, [loadingAddCompany])

  return (
    <div >
      <Drawer>
        <DrawerTrigger>
          <Button size="sm" variant="secondary">Add company</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add a new company</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col gap-2 p-2">
            <Input name='name' type="text" placeholder="Company name" onChange={handleChange}/>
            {errors.name && <p className="text-red-500">{errors.name}</p>}
            <input name="logo" type="file" accept="image/*" onChange={handleChange}/>
            {errors.logo && <p className="text-red-500">{errors.logo}</p>}
            <Button onClick={handleSubmit}>Submit</Button> 
          </div>
          <DrawerFooter > 
            <DrawerClose asChild>          
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default AddCompanyDrawer;
