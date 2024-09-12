import React, { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import * as yup from 'yup'
import useFetch from "@/hooks/useFetch";
import { applyToJobs } from "@/app/db/apiApplications";
import { BeatLoader } from "react-spinners";


const ApplyJobDrawer = ({ user, job, applied = false, fetchJob }) => {

  const [formData, setFormData] = useState({
    name : user?.user_metadata?.name,
    experience: null,
    skills: "",
    education: "Intermediate",
    resume: null,
    candidate_id : user?.id,
    job_id : job?.id,
    status : "applied"
  })
  const [errors, setErrors] = useState({})

  const{loading:loadingApply, error:errorApply, fn:fnApply} = useFetch(applyToJobs, formData)

  const handleChange = (e)=>{
    const {name, value, files} = e.target;
    setFormData((prevData)=>({
      ...prevData,
      [name]: files ? files[0] : value,
    }))
  }

  const handleRadioChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      education: value,
    }));
  };

  const handleSubmit = async ()=>{
    setErrors([]);
    try {
      const schema = yup.object({
        experience: yup.number().min(0, "Experience must be at least 0").required("Experience is required").integer("Experience must be an integer"),
        skills: yup.string().required("Skills are required"),
        education: yup.string().oneOf(["Intermediate", "Graduate", "Post Graduate"], "Education is required").required("Education is required"),
        resume: yup.mixed().required("Resume is required").test("fileType", "Only PDF and Word documents are allowed", (value)=>{
          return value && ['application/pdf', 'application/msword'].includes(value.type)
        })
      })
      await schema.validate(formData, {abortEarly:false})
      await fnApply()
      await fetchJob()
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



  return (
    <Drawer open={applied  ? false : undefined}>
      <DrawerTrigger>
        <Button
          size="lg"
          variant={job?.is_open && !applied ? "blue" : "destructive"}
          disabled={!job?.is_open || applied}
        >
          {job?.is_open ? (applied ? "Applied" : "Apply") : "Hiring closed"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Apply for {job?.title} at {job?.company?.name}
          </DrawerTitle>
          <DrawerDescription>Please fill the form below.</DrawerDescription>
        </DrawerHeader >
        <div className="flex flex-col gap-4 p-4 pb-0">
          <Input
            name="experience"
            type="number"
            placeholder="Years of experience"
            className="flex-1"
            onChange={handleChange}
          />
          {errors.experience && <p className="text-red-500">{errors.experience}</p>}
          <Input
            name="skills"
            type="text"
            placeholder="Skills (comma separated)"
            className="flex-1"
            onChange={handleChange}
          />
          {errors.skills && <p className="text-red-500">{errors.skills}</p>}
          <RadioGroup value={formData.education} onValueChange={handleRadioChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Intermediate" id="intermediate" />
              <Label htmlFor="intermediate">Intermediate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Graduate" id="graduate" />
              <Label htmlFor="graduate">Graduate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Post Graduate" id="post-graduate" />
              <Label htmlFor="post-graduate">Post Graduate</Label>
            </div>
          </RadioGroup>
          {errors.education && <p className="text-red-500">{errors.education}</p>}
          <input name="resume" type="file" accept=".pdf, .doc, .docx" className="flex-1 " onChange={handleChange}/>
          {errors.resume && <p className="text-red-500">{errors.resume}</p>}
          {loadingApply && <BeatLoader size={10} color="#36d7b7"/>}
          <Button variant="blue" onClick={handleSubmit}>Apply</Button>
          </div>
        <DrawerFooter>
          
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ApplyJobDrawer;
