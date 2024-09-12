"use client";
import React, { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { signUp } from "@/app/db/apiAuth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import { UserState } from "@/context/user-context";
import Error from "./error";
import * as Yup from "yup";

export function SignUp() {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    profile_pic: null,
  });
  const router = useRouter();

  const handleInputChange = (e) => {
    const {name, value, files} = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
    console.log(formData);
  };
  
  const {
    data: userData,
    error,
    loading,
    fn: fnSignup,
  } = useFetch(signUp, formData);

  const { fetchUser, user } = UserState();

  useEffect(() => {
    if (error === null && userData) {
      // data is initially null and when fnSignup() is complete then only userData is not null
      console.log("User data after signup:", userData);
      router.push("/onboarding");
      fetchUser(); // calling getCurrentUser() to update user info
      
    }
  }, [userData, error]); // userData changes when fnSignup() run as new user get added

  const handleSignup = async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
        profile_pic: Yup.mixed().required("Profile picture is required"),
      });

      await schema.validate(formData, { abortEarly: false });
      await fnSignup();
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
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>Sign up if you do not have an account</CardDescription>
        {error && <Error message={error?.message} />}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Input
            name="name"
            type="text"
            placeholder="Enter name"
            onChange={handleInputChange}
          />
          {errors.name && <Error message={errors.name} />}
        </div>
        <div className="space-y-1">
          <Input
            name="email"
            type="email"
            placeholder="Enter email"
            onChange={handleInputChange}
          />
          {errors.email && <Error message={errors.email} />}
        </div>
        <div className="space-y-1">
          <Input
            name="password"
            type="password"
            placeholder="Enter password"
            onChange={handleInputChange}
          />
          {errors.password && <Error message={errors.password} />}
        </div>
        <div className="space-y-1">
          <input name="profile_pic" type="file" accept="image/*" onChange={handleInputChange}/>
          <div>
            {errors.profile_pic && <Error message={errors.profile_pic} />}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSignup}>
          {loading ? <BeatLoader size={10} color="green" /> : "Sign Up"}
        </Button>
      </CardFooter>
    </Card>
  );
}
