"use client";
import { UserState } from "@/context/user-context";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import supabase from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/protected-route";

const Onboarding = () => {
  const router = useRouter();
  const handleRoleSelection = async (e) => {
    const updatedData = {
      ...user?.user_metadata,
      role: e 
    }
    await supabase.auth.updateUser({
      data: { 
        ...updatedData
      },
    });
    await fetchUser();
    if (e === "candidate") {
      router.push("/jobs");
    } else {
      router.push("/post-job");
    }
  };
  const { user, fetchUser } = UserState();
  useEffect(() => {
    if (user?.user_metadata.role === "candidate") {
      router.push("/jobs");
    } else if (user?.user_metadata.role === "recruiter") {
      router.push("/post-job");
    }
  }, [user]);


  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center mt-40">
        <h2 className="gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter">
          I am a...
        </h2>
        <div className="mt-16 grid grid-cols-2 gap-4 w-full md:px-40">
          <Button
            variant="blue"
            className="h-36 text-2xl"
            onClick={() => handleRoleSelection("candidate")}
          >
            Candidate
          </Button>
          <Button
            variant="destructive"
            className="h-36 text-2xl"
            onClick={() => handleRoleSelection("recruiter")}
          >
            Recruiter
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Onboarding;
