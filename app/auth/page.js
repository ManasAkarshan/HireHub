"use client";
import { UserState } from "@/context/user-context";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Login } from "./_components/login";
import { SignUp } from "./_components/sign-up";

const Auth = () => {
  const { isAuthenticated, loading, user } = UserState();
  const router = useRouter();
  console.log(user);

  useEffect(() => {
    if (isAuthenticated && loading === false) {
        if (user?.user_metadata.role !== "candidate" &&user?.user_metadata.role !== "recruiter") router.push("/onboarding");
        else router.push(user?.user_metadata.role === "recruiter" ? "/post-job" : "/jobs");
    }
  },[isAuthenticated, loading]);

  return (
    <div className="flex items-center justify-center flex-col mt-28">
      <h1 className="text-4xl mb-5 font-extrabold">Login/Signup</h1>
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2" >
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="login" >
            <Login/>
        </TabsContent>
        <TabsContent value="signup">
          <SignUp/>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
