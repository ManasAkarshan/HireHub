"use client";
import React, { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

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
import * as Yup from "yup";
import useFetch from "@/hooks/useFetch";
import { login } from "@/app/db/apiAuth";
import { useRouter } from "next/navigation";
import { UserState } from "@/context/user-context";
import Error from "./error";

export function Login() {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({email : "",password : ""});
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((preData) => ({
      ...preData,
      [name]: value,
    }));
  };
  const { data:userData, error, loading, fn: fnLogin } = useFetch(login, formData);
  const { fetchUser, user } = UserState();

  useEffect(() => {
    if ((error === null && userData)) { // userData is initially null and when fnLogin() is complete then only userData is not null
      if (user?.user_metadata.role !== "candidate" &&user?.user_metadata.role !== "recruiter") router.push("/onboarding");
      else router.push(user?.user_metadata.role === "recruiter" ? "/post-job" : "/jobs");

      fetchUser(); // calling getCurrentUser() to update user info
    }
  }, [userData, error]);  // userData changes when fnLogin() run as new user get added

  const handleLogin = async () => {
    setErrors({});
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
      });

      await schema.validate(formData, { abortEarly: false });
      await fnLogin();
    } catch (e) {
      const newErrors = {};
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Login to your account if you already have one
        </CardDescription>
        {error && <Error message={error.message} /> } 
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Input
            name="email"
            type="email"
            placeholder="Enter email"
            onChange={handleInputChange}
          />
          {errors.email && <Error message={errors.email}/> }
        </div>
        <div className="space-y-1">
          <Input
            name="password"
            type="password"
            placeholder="Enter password"
            onChange={handleInputChange}
          />
          {errors.password && <Error message={errors.password}/>}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogin}>
          {loading ? <BeatLoader size={10} color="green" /> : "Login"}
        </Button>
      </CardFooter>
    </Card>
  );
}
